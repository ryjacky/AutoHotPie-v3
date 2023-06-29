import {app, ipcMain} from "electron";
import * as child_process from "child_process";
import {GlobalHotkeyService} from "./nativeAPI/GlobalHotkeyService";
import {KeyEvent, RespondType} from "./nativeAPI/KeyEvent";
import {ahpSettings} from "./settings/AHPSettings";
import {ForegroundWindowService} from "./nativeAPI/ForegroundWindowService";
import {logger} from "../main";

/**
 * Sets up IPC listeners for the main process,
 * see typings.d.ts for the list of available listeners and its documentation
 * */
export function initElectronAPI() {
  ipcMain.handle('openInBrowser', (event, args) => {
    logger.info("Opening " + args[0] + " in (default) browser");
    child_process.execSync('start ' + args[0]);
  });

  ipcMain.handle('isUpdateAvailable', async () => {
    logger.info("Checking for updates");
    logger.warn("isUpdateAvailable() is not implemented yet");
    // TODO: Implement isUpdateAvailable
    return true;
  });
  ipcMain.handle('getForegroundApplication', () => {
    logger.info("Retrieving information about the foreground application");

    const fgDetail = JSON.stringify(ForegroundWindowService.foregroundWindow);

    logger.debug("Foreground Window Service returned " + fgDetail);

    return fgDetail ?? "";
  });

  ipcMain.handle('toggleService', (event, args) => {
    logger.info("Toggling Global Hotkey Service. Turning it " + (!args[0] ? "on" : "off") + "");
    // args[0] = serviceActive

    if (GlobalHotkeyService.isRunning()) {
      GlobalHotkeyService.getInstance().exitProcess();
      return false;
    } else {
      GlobalHotkeyService.getInstance();
      return true;
    }
  });
  ipcMain.handle('getVersion', () => {
    logger.info("Retrieving app version, current app version is " + app.getVersion() + "");
    return app.getVersion();
  });
  ipcMain.handle('getSetting', (event, args) => {
    // args[0] = settingKey
    const value = ahpSettings.get(args[0]);

    logger.info("Retrieving setting " + args[0] + ", value is " + value + "");

    return value;
  });
  ipcMain.handle('setSetting', (event, args) => {
    logger.info("Setting " + args[0] + " to " + args[1] + "");
    return ahpSettings.set(args[0], args[1]);
  });
  ipcMain.handle('listenKeyForResult', () => {
    return new Promise(resolve => {
      logger.info("Listening for valid hotkey once");

      const listener = (event: KeyEvent) => {
        if (event.type === RespondType.KEY_DOWN
          && !["Alt",
            "Control",
            "Modifiers",
            "LMenu",
            "RMenu",
            "Capital",
            "Tab",
            "Shift",
            "Escape",
            "LShiftKey",
            "RShiftKey",
            "LControlKey",
            "RControlKey",
            "ControlKey"].includes((event.value.split('+').pop() ?? 'PLACEHOLDER').trim())) {

          GlobalHotkeyService.getInstance().removeTempKeyListener();
          logger.info("Hotkey " + event.value + " is pressed");
          resolve(event.value);
        }
      }

      GlobalHotkeyService.getInstance().addTempKeyListener(listener);

    });

  });
}

export function initLoggerForRenderer() {
  ipcMain.handle('trace', (event, args) => logger.trace(args[0]));
  ipcMain.handle('info', (event, args) => logger.info(args[0]));
  ipcMain.handle('debug', (event, args) => logger.debug(args[0]));
  ipcMain.handle('warn', (event, args) => logger.warn(args[0]));
  ipcMain.handle('error', (event, args) => logger.error(args[0]));
  ipcMain.handle('fatal', (event, args) => logger.fatal(args[0]));
}
