import {app, BrowserWindow, Menu, screen, Tray} from 'electron';
import {initElectronAPI, initLoggerForRenderer} from "./src/ipcBridge";
import {getGHotkeyServiceInstance, isGHotkeyServiceRunning, KeyEvent, RespondType} from "mousekeyhook.js";
import {Log} from "pielette-core";
import {PieletteAddonManager} from "./src/plugin/PieletteAddonManager";
import {PieMenuWindow} from "./src/pieletteWindows/PieMenuWindow";
import {EditorWindow} from "./src/pieletteWindows/EditorWindow";
import {PieEditorWindow} from "./src/pieletteWindows/PieEditorWindow";
import {PieletteEnv} from "pielette-core/lib/PieletteEnv";

// Variables
let pieMenuWindow: PieMenuWindow | undefined;
let editorWindow: EditorWindow | undefined;
app.setPath("userData", PieletteEnv.DEFAULT_DATA_PATH);

let tray = null;

// Initialization
// User data is initialized in app.component.ts and can only be initialized there (with minimal code).
initGlobalHotkeyService();
initElectronWindows();
initElectronAPI();
initLoggerForRenderer();
initSystemTray();
PieletteAddonManager.loadPlugins();

// Functions
export function initGlobalHotkeyService() {
  if (isGHotkeyServiceRunning()) return;

  Log.main.info('Initializing global hotkey service');

  getGHotkeyServiceInstance().onHotkeyEvent.push(
    (event: KeyEvent) => {
      Log.main.debug('onKeyEvent - ' + event.type + ' ' + event.value)

      switch (event.type) {
        case RespondType.KEY_DOWN:
          //TODO: Get listened hotkeys
          if (event.value.trim() === 'None+A') {
            Log.main.debug('Key down event received, showing pie menu');
            pieMenuWindow?.show();
          }
          break;
        case RespondType.KEY_UP:
          Log.main.debug('Key up event received, closing pie menu');
          if (!pieMenuWindow?.isHidden()) {
            pieMenuWindow?.webContents.send('closePieMenuRequested');
          }
          break;
      }
    });
  getGHotkeyServiceInstance().onProcessExit = (() => {
    Log.main.debug('Global hotkey service exited.');

    editorWindow?.webContents.send('globalHotkeyServiceExited')
  });
}

function initElectronWindows() {
  try {

    // Added 400 ms to fix the black background issue while using transparent window.
    // More details at https://github.com/electron/electron/issues/15947
    app.on('ready', () => setTimeout(createWindow, 400));

    // Note: windows-all-closed listener is removed
    // because we want to keep the app running in the background

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (editorWindow === null) {
        createWindow();
      }
    });

  } catch (e) {
    Log.main.error(e);
  }
}

function createWindow(): BrowserWindow {
  pieMenuWindow = new PieMenuWindow();
  editorWindow = new EditorWindow();

  new PieEditorWindow(1);

  return editorWindow;
}

function initSystemTray() {
  app.whenReady().then(() => {
    // Get screen size
    const { screen } = require('electron')

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
          Log.main.warn("Item1 clicked")
        }
      },
      {
        label: 'Reload Service', type: "normal", click: () => {
          // TODO: IMPLEMENTATION
          Log.main.warn("Item1 clicked")
        }
      },
      {
        label: 'Exit', type: "normal", click: () => {
          app.exit();
        }
      },
    ])
    tray.setToolTip('Pie menyuuus!')
    tray.setContextMenu(contextMenu)
  })
}


export function disablePieMenu() {
  pieMenuWindow?.disable();
}
export function enablePieMenu() {
  pieMenuWindow?.enable();
}

export function hidePieMenu() {
  pieMenuWindow?.hide();
}
