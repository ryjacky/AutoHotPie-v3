import {BrowserWindow} from "electron";
import * as path from "path";
import * as fs from "fs";

export class SplashScreenWindow extends BrowserWindow {
  private readonly prefix = '../../';
  constructor() {
    super({
      width: 720,
      height: 405,
      transparent: true,
      frame: false,
      resizable: false,
      webPreferences: {
        nodeIntegration: false,
        // additionalArguments: [id.toString()],
        preload: path.join(__dirname, '../../preload.js'),
        contextIsolation: true,  // false if you want to run e2e test with Spectron
      },
    });

    // Path when running electron executable
    let editorWindowPath = this.prefix + './index.html#splash-screen';

    if (fs.existsSync(path.join(__dirname, this.prefix + '../dist/index.html'))) {
      // Path when running electron in local folder
      editorWindowPath = this.prefix + '../dist/index.html#splash-screen';
    }

    const editorWindowURL = new URL(path.join('file:', __dirname, editorWindowPath));
    this.loadURL(editorWindowURL.href);
  }

}
