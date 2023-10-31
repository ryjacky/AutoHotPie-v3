import {BrowserWindow, screen} from "electron";
import * as path from 'path';
import * as fs from 'fs';
import {Log} from "pielette-core";
import {Profile} from "../db/data/Profile";
import {globalHotkeyService} from "../../main";
import {IGlobalKeyDownMap, IGlobalKeyEvent} from "node-global-key-listener";
import {PieletteAddonManager} from "../plugin/PieletteAddonManager";
import {PieletteSettings} from "../settings/PieletteSettings";
import {MouseKeyEventHelper} from "../mouseKeyEvent/MouseKeyEventHelper";
import * as activeWindow from "active-win";
import {IProfilePieMenuData} from "../db/data/ProfilePieMenuData";
import {HotkeyToPieMenuIdMap} from "../hotkeyMap/HotkeyMap";

// TODO: Need review
export class PieMenuWindow extends BrowserWindow {
  public isCancelled: boolean = false;

  private disabled: boolean = false;
  private readonly prefix = '../../';

  private exeToProfileIdMap = new Map<string, number>();
  private hotkeyToPieMenuIdMap = new HotkeyToPieMenuIdMap();

  constructor() {
    super({
      transparent: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        // Maker sure the second argument contains the prefix at the beginning
        preload: path.join(__dirname, '../../preload.js'),
        contextIsolation: true,  // false if you want to run e2e test with Spectron
      },
    });

    this.setAlwaysOnTop(true, "screen-saver", 1);
    this.preventClose();
    this.hide();
    this.loadPieMenuURL();

    globalHotkeyService.addListener((e: IGlobalKeyEvent, down: IGlobalKeyDownMap) => {
      switch (e.state) {
        case "DOWN":
          this.onKeyDown(e, down)
          break;
        case "UP":
          this.onKeyUp(e, down);
          break;
      }
    });
  }

  clearListeningHotkeys() {
  }

  addListeningHotkeys(profile: Profile) {
    if (!profile.enabled) {
      return;
    }


  }

  onKeyDown(event: IGlobalKeyEvent, down: IGlobalKeyDownMap): void {
    // Filters ---------------------------------
    if (event.name === PieletteSettings.get('pieMenuCancelKey').split(':')[1]) {
      this.cancel();
      Log.main.debug(`Cancel key pressed: ${event}`);
    }

    if (PieletteAddonManager.isExecuting) {
      Log.main.debug(`PieletteAddonManager.isExecuting: ${PieletteAddonManager.isExecuting}`);
      return;
    }

    // Use default profile if no profile matches the active window
    const profId = this.exeToProfileIdMap.get(activeWindow.sync()?.owner.path ?? '') ?? 1;

    const pieMenuId = this.hotkeyToPieMenuIdMap.getPieMenuId(
      (down["RIGHT CTRL"] || down["LEFT CTRL"]) ?? false,
      (down["RIGHT SHIFT"] || down["LEFT SHIFT"]) ?? false,
      (down["RIGHT SHIFT"] || down["LEFT SHIFT"]) ?? false,
      event.name ?? '',
      profId
    );
    if (!pieMenuId) { return; }

    // Filters end -----------------------------
    this.webContents.send('openPieMenu', pieMenuId);
    this.showInactive();
  }

  onKeyUp(event: IGlobalKeyEvent, down: IGlobalKeyDownMap): void {
    PieletteAddonManager.runAllPieTasks();
    this.hide();
  }

  cancel() {
    this.isCancelled = true;
    this.hide();
  }

  loadPieMenuURL() {
    // Path when running electron executable
    let pieMenuPath = this.prefix + './index.html#pieMenuUI';

    if (fs.existsSync(path.join(__dirname, this.prefix + '../dist/index.html'))) {
      // Path when running electron in local folder
      pieMenuPath = this.prefix + '../dist/index.html#pieMenuUI';
    }

    const pieMenuURL = new URL(path.join('file:', __dirname, pieMenuPath));

    this.loadURL(pieMenuURL.href);
  }

  preventClose() {
    this.on('close', (event) => {
      event.preventDefault();
      this.hide();
    });
  }

  hide() {
    super.hide();
  }

  showInactive() {
    if (this.disabled) {
      return;
    }

    this.isCancelled = false;


    // Show the window at cursor position, centered
    const screenPoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(screenPoint);

    Log.main.debug(`screenPoint: ${JSON.stringify(screenPoint)}`)
    Log.main.debug(`display: ${screenPoint.x - display.bounds.width / 2}, ${screenPoint.y - display.bounds.height / 2}`)
    this.setBounds({
      width: display.bounds.width,
      height: display.bounds.height,
      x: screenPoint.x - display.bounds.width / 2,
      y: screenPoint.y - display.bounds.height / 2,
    });
    super.showInactive();
  }

  disable() {
    this.disabled = true;
    this.hide();
  }

  enable() {
    this.disabled = false;
  }


}
