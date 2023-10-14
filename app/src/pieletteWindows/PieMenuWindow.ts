import {BrowserWindow, screen} from "electron";
import * as path from 'path';
import * as fs from 'fs';
import {GlobalHotkeyService, MouseKeyEventListener} from "pielette-mouse-key-hook";
import {Log} from "pielette-core";
import {Profile} from "../db/data/Profile";
import {PieletteSettings} from "../settings/PieletteSettings";
import * as activeWindow from "active-win";
import {PieletteAddonManager} from "../plugin/PieletteAddonManager";

// TODO: Need review
export class PieMenuWindow extends BrowserWindow implements MouseKeyEventListener {
  public isCancelled: boolean = false;

  private hidden: boolean = false;
  private disabled: boolean = false;
  private readonly prefix = '../../';

  private listeningHotkeys: Map<string, number> = new Map<string, number>();
  private menuExeBindingMap: Map<number, string[]> = new Map<number, string[]>();

  private prevKey: string = "";

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

    this.preventClose();
    this.hide();
    this.loadPieMenuURL();
    GlobalHotkeyService.getInstance().addOnMouseKeyEvent(this);
  }

  clearListeningHotkeys() {
    this.listeningHotkeys.clear();
  }

  addListeningHotkeys(profile: Profile) {
    for (const hotkey of profile.pieMenuHotkeys) {
      // idAndHotkey[0] is the hotkey, idAndHotkey[1] is the pie menu id
      const idAndHotkey = hotkey.split('-');
      Log.main.debug(`Adding hotkey ${idAndHotkey[0]}`)

      this.menuExeBindingMap.set(Number(idAndHotkey[1]), [
        ...(this.menuExeBindingMap.get(Number(idAndHotkey[1])) ?? []),
        ...(profile.id === 1 ? ["global"] : (profile.exes))
      ]);
      this.listeningHotkeys.set(idAndHotkey[0], Number(idAndHotkey[1]));
    }
  }

  onDoubleClick(event: string): void {
    this.prevKey = event;

  }

  onDragStarted(event: string): void {
    this.prevKey = event;

  }

  onDragFinished(event: string): void {
    this.prevKey = event;

  }

  onKeyDown(event: string): void {
    // Filters ---------------------------------
    if (event.split(':')[1] === PieletteSettings.get('pieMenuCancelKey').split(':')[1]) {
      this.cancel();
    }
    // Search for the pie menu id related to the hotkey
    const pieMenuId = this.listeningHotkeys.get(event);

    if (!pieMenuId || PieletteAddonManager.isExecuting || this.prevKey === event) {
      return;
    }

    // 1 is the id of the global pie menu
    if (!this.menuExeBindingMap.get(pieMenuId)?.includes(activeWindow.sync()?.owner.path ?? "global")
      && !this.menuExeBindingMap.get(pieMenuId)?.includes("global")) {
      Log.main.debug(JSON.stringify(Array.from(this.menuExeBindingMap.entries())))
      return;
    }


    // Filters end -----------------------------
    this.prevKey = event;

    // We don't want to keep updating the pie menu
    if (this.hidden) this.webContents.send('openPieMenu', pieMenuId);
    this.showInactive();
  }

  onKeyUp(event: string): void {
    this.prevKey = event;
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

  isHidden() {
    return this.hidden;
  }

  hide() {
    if (!this.hidden) {
      this.hidden = true;

      super.hide();
    }
  }

  showInactive() {
    if (this.disabled) {
      return;
    }

    this.isCancelled = false;

    if (this.hidden) {
      this.hidden = false;

      // Show the window at cursor position, centered
      const screenPoint = screen.getCursorScreenPoint();
      const display = screen.getDisplayNearestPoint(screenPoint);

      Log.main.debug(`screenPoint: ${JSON.stringify(screenPoint)}`)
      Log.main.debug(`display: ${screenPoint.x - display.bounds.width / 2}, ${screenPoint.y - display.bounds.height / 2}`)
      // YES, why do I need to do this, the window just offsets when it restore so I just spam set the bounds
      this.setBounds({
        width: display.bounds.width,
        height: display.bounds.height,
        x: screenPoint.x - display.bounds.width / 2,
        y: screenPoint.y - display.bounds.height / 2,
      });
      super.showInactive();
    }
  }

  disable() {
    this.disabled = true;
    this.hide();
  }

  enable() {
    this.disabled = false;
  }


}
