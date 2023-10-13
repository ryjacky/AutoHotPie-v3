const {contextBridge, ipcRenderer} = require('electron')

console.log("preload.js is loaded")

// !!! IMPORTANT !!!
// Also declare the API you want to expose in typings.d.ts

contextBridge.exposeInMainWorld('dbAPI', {
  // ---------------------- Invoke ----------------------
  // hotkeys: string[]
  possibleHotkeyChange: (profileArrayJson) => ipcRenderer.invoke('db.possibleHotkeyChange', profileArrayJson),

  // ---------------------- On ----------------------

});

contextBridge.exposeInMainWorld('pieMenuAPI', {
  // ---------------------- Invoke ----------------------
  cancel: () => ipcRenderer.invoke('pieMenu.cancel'),

  // ---------------------- On ----------------------

});

contextBridge.exposeInMainWorld('electronAPI', {
  disablePieMenu: () => ipcRenderer.invoke('disablePieMenu'),
  enablePieMenu: () => ipcRenderer.invoke('enablePieMenu'),
  openInBrowser: (url) => ipcRenderer.invoke('openInBrowser', [url]),
  isUpdateAvailable: () => ipcRenderer.invoke('isUpdateAvailable'),
  getForegroundApplication: () => ipcRenderer.invoke('getForegroundApplication'),
  toggleService: (serviceActive) => ipcRenderer.invoke('toggleService', [serviceActive]),
  listenKeyForResult: (ignoredKeys) => ipcRenderer.invoke('listenKeyForResult', [ignoredKeys]),
  getVersion: () => ipcRenderer.invoke('getVersion'),
  globalHotkeyServiceExited: (callback) => ipcRenderer.on('globalHotkeyServiceExited', callback),
  openPieMenu: (callback) => ipcRenderer.on('openPieMenu', (event, pieMenuId) => {callback(pieMenuId)}),
  getSetting: (settingName) => ipcRenderer.invoke('getSetting', [settingName]),
  setSetting: (settingName, value) => ipcRenderer.invoke('setSetting', [settingName, value]),
  openDialogForResult: (defaultPath, filter) => ipcRenderer.invoke('openDialogForResult', [defaultPath, filter]),
  getPieTaskAddonHeaders: () => ipcRenderer.invoke('getPieTaskAddonHeaders'),
  getFileIconBase64: (path) => ipcRenderer.invoke('getFileIconBase64', [path]),
  setPieTasks: (pieTasksJSON) => ipcRenderer.invoke('setPieTasks', [pieTasksJSON]),
  openPieMenuEditor: (pieMenuId) => ipcRenderer.invoke('openPieMenuEditor', [pieMenuId]),
  addHotkey: (hotkeyString, pieMenuId) => ipcRenderer.invoke('addHotkey', [hotkeyString, pieMenuId]),
})

contextBridge.exposeInMainWorld('log', {
  trace: (message) => ipcRenderer.invoke('trace', [message]),
  debug: (message) => ipcRenderer.invoke('debug', [message]),
  info: (message) => ipcRenderer.invoke('info', [message]),
  warn: (message) => ipcRenderer.invoke('warn', [message]),
  error: (message) => ipcRenderer.invoke('error', [message]),
  fatal: (message) => ipcRenderer.invoke('fatal', [message]),
})
