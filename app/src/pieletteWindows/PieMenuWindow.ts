import {BrowserWindow, screen} from "electron";
import * as path from 'path';
import * as fs from 'fs';
import {GlobalHotkeyService, MouseKeyEventListener} from "pielette-mouse-key-hook";
import {Log} from "pielette-core";
import {Profile} from "../db/data/Profile";
import {PieletteSettings} from "../settings/PieletteSettings";

export class PieMenuWindow extends BrowserWindow implements MouseKeyEventListener {
  public isCancelled: boolean = false;

  private hidden: boolean = false;
  private disabled: boolean = false;
  private readonly prefix = '../../';

  private listeningHotkeys: Map<string, number> = new Map<string, number>();

  constructor() {
    super({
      transparent: true,
      frame: false,
      alwaysOnTop: true,
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
      const idAndHotkey = hotkey.split('-');
      Log.main.debug(`Adding hotkey ${idAndHotkey[0]}`)

      this.listeningHotkeys.set(idAndHotkey[0], Number(idAndHotkey[1]));
    }
  }

  onDoubleClick(event: string): void {
  }

  onDragStarted(event: string): void {
  }

  onDragFinished(event: string): void {

  }

  onKeyDown(event: string): void {
    if (event.split(':')[1] === PieletteSettings.get('pieMenuCancelKey').split(':')[1]){
      this.isCancelled = true;
      this.hide();
    }
    // Search for the pie menu id related to the hotkey
    const pieMenuId = this.listeningHotkeys.get(event);

    if (!pieMenuId) { return; }

    // We don't want to keep updating the pie menu
    if (this.hidden) this.webContents.send('openPieMenu', pieMenuId);
    this.show();
  }

  onKeyUp(event: string): void {
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

  show() {
    if (this.disabled) {
      return;
    }

    this.isCancelled = false;

    if (this.hidden) {
      this.hidden = false;

      // Show the window at cursor position, centered
      const screenPoint = screen.getCursorScreenPoint();
      const display = screen.getDisplayNearestPoint(screenPoint);

      const bleed = 500;

      this.setBounds({
        width: display.bounds.width + bleed * 2,
        height: display.bounds.height + bleed * 2,
        x: display.bounds.x - bleed,
        y: display.bounds.y - bleed
      })

      super.show();
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
