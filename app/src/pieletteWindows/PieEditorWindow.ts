import {BrowserWindow} from "electron";
import {EditorConstants} from "../constants/EditorConstants";
import * as path from "path";
import * as fs from "fs";

export class PieEditorWindow extends BrowserWindow {
  private readonly prefix = '../../';
  constructor(id: number) {
    super({
      minWidth: EditorConstants.WINDOW_WIDTH,
      minHeight: EditorConstants.WINDOW_HEIGHT,
      width: EditorConstants.WINDOW_WIDTH,
      height: EditorConstants.WINDOW_HEIGHT,
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#1f2122',
        symbolColor: '#74b1be',

        // !!! IMPORTANT !!!
        // --title-bar-height should also be updated in styles.scss when you change the height
        // 2px is subtracted from the height because of the border
        height: 42 - 2
      },
      webPreferences: {
        nodeIntegration: false,
        // additionalArguments: [id.toString()],
        preload: path.join(__dirname, '../../preload.js'),
        contextIsolation: true,  // false if you want to run e2e test with Spectron
      },
    });

    // Path when running electron executable
    let editorWindowPath = this.prefix + './index.html#pie-menu-editor?pieMenuId=' + id;

    if (fs.existsSync(path.join(__dirname, this.prefix + '../dist/index.html'))) {
      // Path when running electron in local folder
      editorWindowPath = this.prefix + '../dist/index.html#pie-menu-editor?pieMenuId=' + id;
    }

    const editorWindowURL = new URL(path.join('file:', __dirname, editorWindowPath));
    this.loadURL(editorWindowURL.href);
  }
}
