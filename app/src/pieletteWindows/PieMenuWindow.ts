import {BrowserWindow, screen} from "electron";
import * as path from 'path';
import * as fs from 'fs';
import {GlobalHotkeyService, IMouseKeyEvent, MouseKeyEventListener} from "pielette-mouse-key-hook";

export class PieMenuWindow extends BrowserWindow implements MouseKeyEventListener {
  private hidden: boolean = false;
  private disabled: boolean = false;
  private readonly prefix = '../../';

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

  onDoubleClick(event: IMouseKeyEvent): void {
  }

  onDragStarted(event: IMouseKeyEvent): void {
  }

  onDragFinished(event: IMouseKeyEvent): void {
    if (!this.hidden) {
      this.webContents.send('closePieMenuRequested');
    }
  }

  onKeyDown(event: IMouseKeyEvent): void {
    if (event.alt && event.shift && event.control)
      this.show();

  }

  onKeyUp(event: IMouseKeyEvent): void {
    if (!this.hidden) {
      this.webContents.send('closePieMenuRequested');
    }
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

    if (this.hidden) {
      this.hidden = false;

      // Show the window at cursor position, centered
      const primaryScreenWidth = screen.getPrimaryDisplay().bounds.width;
      const primaryScreenHeight = screen.getPrimaryDisplay().bounds.height;

      this.setBounds({
        width: primaryScreenWidth,
        height: primaryScreenHeight,
        // TODO: Does not work with digital pen when the cursor is on top of any chromium window
        x: screen.getCursorScreenPoint().x - primaryScreenWidth / 2,
        y: screen.getCursorScreenPoint().y - primaryScreenHeight / 2
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
