import {app, ipcMain, dialog} from "electron";
import * as child_process from "child_process";
import {PieletteSettings} from "./settings/PieletteSettings";
import * as activeWindow from "active-win";
import {getGHotkeyServiceInstance, isGHotkeyServiceRunning, KeyEvent, RespondType} from "mousekeyhook.js";
import {ReadonlyWindowDetails} from "./appWindow/WindowDetails";
import {Log} from "pielette-core";
import {PieletteAddonManager} from "./plugin/PieletteAddonManager";
import {PieTaskContext} from "./actions/PieTaskContext";
import {disablePieMenu, enablePieMenu, hidePieMenu, initGlobalHotkeyService} from "../main";
import {PieEditorWindow} from "./pieletteWindows/PieEditorWindow";

/**
 * Sets up IPC listeners for the main process,
 * see typings.d.ts for the list of available listeners and its documentation
 * */
export function initElectronAPI() {
  ipcMain.handle('openPieMenuEditor', (event, args) => {
    // args[0] = pieMenuId
    Log.main.info("Opening pie menu editor for pie menu " + args[0] + "");
    new PieEditorWindow(args[0]);
  });
  ipcMain.handle('openInBrowser', (event, args) => {
    Log.main.info("Opening " + args[0] + " in (default) browser");
    child_process.execSync('start ' + args[0]);
  });

  ipcMain.handle('isUpdateAvailable', async () => {
    Log.main.info("Checking for updates");
    Log.main.warn("isUpdateAvailable() is not implemented yet");
    // TODO: Implement isUpdateAvailable
    return true;
  });
  ipcMain.handle('getForegroundApplication', async () => {
    Log.main.info("Retrieving information about the foreground application");

    const result = activeWindow.sync();

    if (result === undefined) return "";

    const base64Icon = (await app.getFileIcon(result.owner.path)).toDataURL();

    return JSON.stringify(new ReadonlyWindowDetails(
      result.title,
      result.id,
      result.bounds,
      result.owner,
      result.memoryUsage,
      base64Icon,
    ))
  });

  ipcMain.handle('getFileIcon', (event, args) => app.getFileIcon(args[0]));

  ipcMain.handle('toggleService', (event, args) => {
    Log.main.info("Toggling Global Hotkey Service. Turning it " + (!args[0] ? "on" : "off") + "");
    // args[0] = serviceActive

    if (isGHotkeyServiceRunning()) {
      getGHotkeyServiceInstance().exitProcess();
      return false;
    } else {
      initGlobalHotkeyService();
      return true;
    }
  });
  ipcMain.handle('runPieTasks', (event, args) => {
    hidePieMenu();

    // args[0] = actionListJson
    let contexts = JSON.parse(args[0]) as PieTaskContext[];
    for (let context of contexts) {
      Log.main.debug(`Running action ${context.addonId} with parameters ${JSON.stringify(context.args)}`)

      PieletteAddonManager.runPieTasks(context);
    }
  });
  ipcMain.handle('getVersion', () => {
    Log.main.info("Retrieving app version, current app version is " + app.getVersion() + "");
    return app.getVersion();
  });
  ipcMain.handle('getSetting', (event, args) => {
    // args[0] = settingKey
    const value = PieletteSettings.get(args[0]);

    Log.main.info("Retrieving setting " + args[0] + ", value is " + value + "");

    return value;
  });
  ipcMain.handle('setSetting', (event, args) => {
    Log.main.info("Setting " + args[0] + " to " + args[1] + "");
    return PieletteSettings.set(args[0], args[1]);
  });
  ipcMain.handle('openDialogForResult', (event, args) => {
    // args[0] = default path
    return dialog.showOpenDialogSync({
      defaultPath: args[0],
      filters: [{name: "Executables", extensions: ["exe"]}],
      properties: ['openFile']
    })
  });
  ipcMain.handle('disablePieMenu', () => disablePieMenu());
  ipcMain.handle('enablePieMenu', () => enablePieMenu());
  ipcMain.handle('getPieTaskAddonHeaders', () => {

    const pieTaskAddonHeaderJSONArr: string[] = [];
    for (const pieTaskAddonHeader of PieletteAddonManager.headerObject) {
      pieTaskAddonHeaderJSONArr.push(JSON.stringify(pieTaskAddonHeader));
    }

    return pieTaskAddonHeaderJSONArr;
  });
  ipcMain.handle('listenKeyForResult', (event, args) => {
    // args[0] = ignoredKeys
    if (!isGHotkeyServiceRunning()) {
      return;
    }

    return new Promise(resolve => {
      Log.main.info("Listening for valid hotkey once");
      disablePieMenu();

      const listener = (event: KeyEvent) => {
        if (event.type === RespondType.KEY_DOWN
          && !args[0].includes((event.value.split('+').pop() ?? 'PLACEHOLDER').trim())) {

          getGHotkeyServiceInstance().removeTempKeyListener();
          Log.main.info("Hotkey " + event.value + " is pressed");
          enablePieMenu();
          resolve(event.value);
        }
      }

      getGHotkeyServiceInstance().addTempKeyListener(listener);

    });

  });
}

export function initLoggerForRenderer() {
  ipcMain.handle('trace', (event, args) => Log.renderer.trace(args[0]));
  ipcMain.handle('info', (event, args) => Log.renderer.info(args[0]));
  ipcMain.handle('debug', (event, args) => Log.renderer.debug(args[0]));
  ipcMain.handle('warn', (event, args) => Log.renderer.warn(args[0]));
  ipcMain.handle('error', (event, args) => Log.renderer.error(args[0]));
  ipcMain.handle('fatal', (event, args) => Log.renderer.fatal(args[0]));
}
