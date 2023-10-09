import {BrowserWindow, screen} from "electron";
import * as path from 'path';
import * as fs from 'fs';
import {GlobalHotkeyService, IMouseKeyEvent, MouseKeyEventListener} from "pielette-mouse-key-hook";

export class PieMenuWindow extends BrowserWindow implements MouseKeyEventListener {
  private hidden: boolean = false;
  private disabled: boolean = false;
  private readonly prefix = '../../';

  private readonly x: number = 0;
  private readonly y: number = 0;
  private readonly width: number = 0;
  private readonly height: number = 0;

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

    for (const display of screen.getAllDisplays()) {
      if (display.bounds.x < this.x) { this.x = display.bounds.x; }
      if (display.bounds.y < this.y) { this.y = display.bounds.y; }
      this.width += display.bounds.width;
      this.height += display.bounds.height;
    }

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
      this.show(event.x, event.y);

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

  show(x?: number, y?: number) {
    if (this.disabled) {
      return;
    }

    if (this.hidden) {
      this.hidden = false;

      // FIXME: creating window across all monitors because getCursorScreenPoint() is not working with windows ink
      //  enabled window such as chrome, windows default photo viewer, etc.
      this.setBounds({
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y
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
