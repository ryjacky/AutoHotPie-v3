"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashScreenWindow = void 0;
const electron_1 = require("electron");
const path = require("path");
const fs = require("fs");
class SplashScreenWindow extends electron_1.BrowserWindow {
    constructor() {
        super({
            width: 720,
            height: 405,
            transparent: true,
            alwaysOnTop: true,
            frame: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: false,
                // additionalArguments: [id.toString()],
                preload: path.join(__dirname, '../../preload.js'),
                contextIsolation: true, // false if you want to run e2e test with Spectron
            },
        });
        this.prefix = '../../';
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
exports.SplashScreenWindow = SplashScreenWindow;
//# sourceMappingURL=SplashScreenWindow.js.map