import {app, BrowserWindow, Menu, Tray} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import {GlobalHotkeyService} from "./src/nativeAPI/GlobalHotkeyService";
import {initializeIPCListeners} from "./src/ipcBridge";
import {Preferences} from "./src/preferences/Preferences";
import {KeyEvent} from "./src/nativeAPI/KeyEvent";

// Constants
const EDITOR_WINDOW_WIDTH = 1080;
const EDITOR_WINDOW_HEIGHT = 720;
let pieMenuWindow: BrowserWindow | undefined;
let editorWindow: BrowserWindow | undefined;

let tray = null


// ----------------- Set up GlobalHotkeyService -----------------

Preferences.init();
GlobalHotkeyService.getInstance();

// Listeners are instance independent
GlobalHotkeyService.addKeyEventListener(
    (event: KeyEvent) => {
        console.log("Main process received a key event from the global hotkey service: " + event.type + " " + event.value);
    })
    .setOnCloseListener(() => {
        console.log("Main process received the exit signal from the global hotkey service.");
        editorWindow?.webContents.send('globalHotkeyServiceExited')
    });


// ----------------- Set up electron window -----------------
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => setTimeout(createWindow, 400));

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (editorWindow === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}

function createWindow(): BrowserWindow {
    editorWindow = new BrowserWindow({
        minWidth: EDITOR_WINDOW_WIDTH,
        minHeight: EDITOR_WINDOW_HEIGHT,
        width: EDITOR_WINDOW_WIDTH,
        height: EDITOR_WINDOW_HEIGHT,
        // titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#2f3241',
            symbolColor: '#74b1be',

            // !!! IMPORTANT !!!
            // --title-bar-height should also be updated in styles.scss when you change the height
            height: 42
        },
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,  // false if you want to run e2e test with Spectron
        },
    });

    pieMenuWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,  // false if you want to run e2e test with Spectron
        },
    });

    // Path when running electron executable
    let editorWindowPath = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
        // Path when running electron in local folder
        editorWindowPath = '../dist/index.html';
    }

    const editorWindowURL = new URL(path.join('file:', __dirname, editorWindowPath));
    editorWindow.loadURL(editorWindowURL.href);

    pieMenuWindow.loadURL('file://' + __dirname + '/../src/app/pie-menu-ui/pie-menu-ui.component.html');


    editorWindow.on('close', (event) => {
        event.preventDefault();
        editorWindow?.hide();
    });

    return editorWindow;
}

// ----------------- Set up IPC listeners -----------------
initializeIPCListeners();

// ----------------- Set up tray -----------------
app.whenReady().then(() => {
    // TODO
    tray = new Tray(__dirname + '/assets/favicon.ico')
    const contextMenu = Menu.buildFromTemplate([
        {label: 'AutoHotPie', type: "normal", enabled: false},
        {type: "separator"},
        {
            label: 'Setting', type: "normal", click: () => {
                editorWindow?.show();
            }
        },
        {
            label: 'Restart', type: "normal", click: () => {
                // TODO: IMPLEMENTATION
                console.log("Item1 clicked")
            }
        },
        {
            label: 'Reload Service', type: "normal", click: () => {
                // TODO: IMPLEMENTATION
                console.log("Item1 clicked")
            }
        },
        {
            label: 'Exit', type: "normal", click: () => {
                app.exit();
            }
        },
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
})
