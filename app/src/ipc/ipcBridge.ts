import {app, dialog, ipcMain, nativeImage} from "electron";
import * as child_process from "child_process";
import {PieletteSettings} from "../settings/PieletteSettings";
import * as activeWindow from "active-win";
import {Log} from "pielette-core";
import {PieletteAddonManager} from "../plugin/PieletteAddonManager";
import {PieSingleTaskContext} from "../actions/PieSingleTaskContext";
import {pieMenuWindow} from "../../main";
import {PieEditorWindow} from "../pieletteWindows/PieEditorWindow";
import {PieletteEnv} from "pielette-core/lib/PieletteEnv";
import {IBinaryInfo} from "../binaryInfo/IBinaryInfo";

/**
 * Sets up IPC listeners for the main process,
 * see typings.d.ts for the list of available listeners and its documentation
 * */

export function initIPC() {
  // -------------------------- IPCEvents relating to the system --------------------------
  ipcMain.handle('system.getOpenWindows', async () => {
    const results = await activeWindow.getOpenWindows();

    // Restructure the data to the common interface between renderer and main process
    let binaryInfo: IBinaryInfo[] = [];
    for (const result of results) {
      if (result.owner.name && result.owner.path) {
        binaryInfo.push(
          {
            name: result.owner.name,
            path: result.owner.path,
            iconBase64: (await app.getFileIcon(result.owner.path)).toDataURL(),
          });
      }
    }
    return JSON.stringify(binaryInfo.values());
  });







  ipcMain.handle('openPieMenuEditor', (event, args) => {
    // args[0] = pieMenuId
    Log.main.info("Opening pie menu editor for pie menu " + args[0] + "");
    new PieEditorWindow(args[0]);
  });
  ipcMain.handle('openInBrowser', (event, args) => {
    Log.main.info("Opening " + args[0] + " in (default) browser");
    child_process.execSync('start ' + args[0]);
  });

  ipcMain.handle('getFileIconBase64', async (event, args) => {
    const filePath = args[0];
    try {
      return (await nativeImage.createThumbnailFromPath(filePath, {width: 32, height: 32})).toDataURL();
    } catch (e) {
      return (await app.getFileIcon(filePath)).toDataURL();
    }
  });

  ipcMain.handle('setPieTasks', async (event, args) => {
    // args[0] = actionListJson
    if (pieMenuWindow?.isCancelled) {return;}

    let contexts = JSON.parse(args[0]) as PieSingleTaskContext[];
    PieletteAddonManager.setPieTasks(contexts);
  });
  ipcMain.handle('getVersion', () => {
    Log.main.info("Retrieving app version, current app version is " + app.getVersion() + "");
    return app.getVersion();
  });
  ipcMain.handle('getSetting', (event, args) => {
    // args[0] = settingKey
    if (args[0] === "runOnStartup") {
      return app.getLoginItemSettings().openAtLogin;
    }

    const value = PieletteSettings.get(args[0]);

    Log.main.info("Retrieving setting " + args[0] + ", value is " + value + "");

    return value;
  });
  ipcMain.handle('setSetting', (event, args) => {
    Log.main.info("Setting " + args[0] + " to " + args[1] + "");

    if (args[0] === "runOnStartup") {
      app.setLoginItemSettings({
        openAtLogin: args[1] as boolean,
        openAsHidden: true
      })

      return;
    }

    return PieletteSettings.set(args[0], args[1]);
  });
  ipcMain.handle('openDialogForResult', (event, args) => {
    // args[0] = default path
    // args[1] = filters

    args[0] = args[0].replace("%appdata%\\Pielette\\", PieletteEnv.DEFAULT_DATA_PATH).replaceAll("/", "\\")
    Log.main.info("Opening dialog for file selection, default path is " + args[0] + "");

    return dialog.showOpenDialogSync({
      defaultPath: args[0],
      filters: args[1],
      properties: ['openFile']
    })
  });
  ipcMain.handle('getPieTaskAddonHeaders', () => {

    const pieTaskAddonHeaderJSONArr: string[] = [];
    for (const pieTaskAddonHeader of PieletteAddonManager.headerObject) {
      pieTaskAddonHeaderJSONArr.push(JSON.stringify(pieTaskAddonHeader));
    }

    return pieTaskAddonHeaderJSONArr;
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
