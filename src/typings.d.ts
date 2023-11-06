/* SystemJS module definition */

declare const nodeModule: NodeModule;

interface NodeModule {
  id: string;
}

interface Window {
  process: any;
  require: any;
  system: {
    getOpenWindows: () => Promise<string>;
  };
  pieMenu: {
    onKeyDown: (callback: (exePath: string, ctrl: boolean, alt: boolean, shift: boolean, key: string) => void) => void;
    onKeyUp: (callback: () => void) => void;
    ready: () => void;
    execute: (pieTask: string) => void;
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
    openDialogForResult: (defaultPath: string, filter: [{name: string; extensions: string[]}]) => Promise<string>;
    getFileIconBase64: (path: string) => Promise<string>;


    openPieMenu: (callback: (pieMenuId: number) => void) => void;

    getVersion: () => Promise<string>;

    getSetting: (settingName: string) => Promise<any>;
    setSetting: (settingName: string, value: any) => any;
  };
}
