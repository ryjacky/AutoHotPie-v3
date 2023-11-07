import {BrowserWindow, ipcMain, screen} from "electron";
import * as path from 'path';
import * as fs from 'fs';
import {Log} from "pielette-core";
import {globalHotkeyService} from "../../main";
import {IGlobalKeyDownMap, IGlobalKeyEvent} from "node-global-key-listener";
import * as activeWindow from "active-win";

// TODO: Need review
export class PieMenuWindow extends BrowserWindow {
  public isCancelled: boolean = false;

  private disabled: boolean = false;
  private readonly prefix = '../../';

  private hidden: boolean = true;

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
          if (!this.hidden) { break; }
          this.webContents.send(
            'pieMenu.onKeyDown',
            activeWindow.sync()?.owner.path ?? "",
            down["LEFT CTRL"] || down["RIGHT CTRL"],
            down["LEFT ALT"] || down["RIGHT ALT"],
            down["LEFT SHIFT"] || down["RIGHT SHIFT"],
            e.name);
          break;
        case "UP":
          this.webContents.send('pieMenu.onKeyUp')
          break;
      }
    });

    ipcMain.handle('pieMenu.ready', () => {
      this.showInactive();
    });
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
    this.hidden = true;
  }

  showInactive() {
    if (this.disabled) {
      return;
    }

    this.isCancelled = false;
    this.hidden = false;

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


}
