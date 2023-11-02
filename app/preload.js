const {contextBridge, ipcRenderer} = require('electron')

console.log("preload.js is loaded")

// !!! IMPORTANT !!!
// Also declare the API you want to expose in typings.d.ts

contextBridge.exposeInMainWorld('system', {
  // ---------------------- Invoke ----------------------
  getOpenWindows: () => ipcRenderer.invoke('system.getOpenWindows'),

  // ---------------------- On ----------------------

});

contextBridge.exposeInMainWorld('pieMenu', {
  // ---------------------- Invoke ----------------------
  ready: () => ipcRenderer.invoke('pieMenu.ready'),

  // ---------------------- On ----------------------
  onKeyDown: (callback) => ipcRenderer.on('pieMenu.onKeyDown', (event, exePath, ctrl, alt, shift, key) => {callback(exePath, ctrl, alt, shift, key)}),
  onKeyUp: (callback) => ipcRenderer.on('pieMenu.onKeyUp', (event) => {callback()}),
});

contextBridge.exposeInMainWorld('electronAPI', {
  openInBrowser: (url) => ipcRenderer.invoke('openInBrowser', [url]),
  getVersion: () => ipcRenderer.invoke('getVersion'),
  openPieMenu: (callback) => ipcRenderer.on('openPieMenu', (event, pieMenuId) => {callback(pieMenuId)}),
  getSetting: (settingName) => ipcRenderer.invoke('getSetting', [settingName]),
  setSetting: (settingName, value) => ipcRenderer.invoke('setSetting', [settingName, value]),

  // TODO: change name
  openDialogForResult: (defaultPath, filter) => ipcRenderer.invoke('openDialogForResult', [defaultPath, filter]),
  getPieTaskAddonHeaders: () => ipcRenderer.invoke('getPieTaskAddonHeaders'),
  getFileIconBase64: (path) => ipcRenderer.invoke('getFileIconBase64', [path]),
  // TODO: add docstring
  setPieTasks: (pieTasksJSON) => ipcRenderer.invoke('setPieTasks', [pieTasksJSON]),

  // TODO: remove
  openPieMenuEditor: (pieMenuId) => ipcRenderer.invoke('openPieMenuEditor', [pieMenuId]),
})

contextBridge.exposeInMainWorld('log', {
  trace: (message) => ipcRenderer.invoke('trace', [message]),
  debug: (message) => ipcRenderer.invoke('debug', [message]),
  info: (message) => ipcRenderer.invoke('info', [message]),
  warn: (message) => ipcRenderer.invoke('warn', [message]),
  error: (message) => ipcRenderer.invoke('error', [message]),
  fatal: (message) => ipcRenderer.invoke('fatal', [message]),
})
