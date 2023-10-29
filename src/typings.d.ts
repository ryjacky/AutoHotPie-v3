/* SystemJS module definition */

declare const nodeModule: NodeModule;

interface NodeModule {
  id: string;
}

interface Window {
  process: any;
  require: any;
  dbAPI: {
    possibleHotkeyChange: (profileArrayJson: string) => void;
  };
  pieMenuAPI: {
    done: () => void;
    onForceRun: (callback: () => void) => void;
  };
  system: {
    getOpenWindows: () => Promise<string>;
  };
  log: {
    trace: (message: string) => void;
    debug: (message: string) => void;
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    fatal: (message: string) => void;
  };
  electronAPI: {
    openPieMenuEditor: (pieMenuId: number) => void;
    setPieTasks: (pieTasksJSON: string) => void;
    getPieTaskAddonHeaders: () => Promise<string[]>;
    openInBrowser: (url: string) => void;
    isUpdateAvailable: () => Promise<boolean>;
    openDialogForResult: (defaultPath: string, filter: [{name: string; extensions: string[]}]) => Promise<string>;
    getFileIconBase64: (path: string) => Promise<string>;

    /**
     * Returns the path to the executable and the path to the icon of the foreground application
     * @returns JSON string of ForegroundWindow returned by ForegroundWindow.toJsonString()
     */
    getForegroundApplication: () => Promise<string>;

    /**
     * Toggle pie menu service.
     * @param serviceActive
     *
     * @returns The status of the service after toggling, true if active, false if inactive
     */
    toggleService: (serviceActive: boolean) => Promise<boolean>;

    listenKeyForResult: (ignoredKeys: string[]) => Promise<string> | undefined;

    globalHotkeyServiceExited: (callback: () => void) => void;
    openPieMenu: (callback: (pieMenuId: number) => void) => void;

    getVersion: () => Promise<string>;

    getSetting: (settingName: string) => Promise<any>;
    addHotkey: (hotkeyString: string, pieMenuId: number) => void;
    setSetting: (settingName: string, value: any) => any;
    disablePieMenu: () => void;
    enablePieMenu: () => void;
  };
}
