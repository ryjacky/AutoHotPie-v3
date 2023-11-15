const {contextBridge, ipcRenderer} = require('electron')

console.log("preload.js is loaded")


// !!! IMPORTANT !!!
// Also declare the API you want to expose in typings.d.ts

contextBridge.exposeInMainWorld('system', {
  // ---------------------- Invoke ----------------------
  getOpenWindows: () => ipcRenderer.invoke('system.getOpenWindows'),
  removeOnKeyDown: (callback) => ipcRenderer.on('system.removeOnKeyDown', (event, exePath, ctrl, alt, shift, key) => {callback(exePath, ctrl, alt, shift, key)}),

  // ---------------------- On ----------------------
  onKeyDown: (callback) => ipcRenderer.on('system.onKeyDown', (event, exePath, ctrl, alt, shift, key) => {callback(exePath, ctrl, alt, shift, key)}),
  onKeyUp: (callback) => ipcRenderer.on('system.onKeyUp', () => {callback()}),
});

contextBridge.exposeInMainWorld('pieMenu', {
  // ---------------------- Invoke ----------------------
  ready: () => ipcRenderer.invoke('pieMenu.ready'),
  execute: (pieTask) => ipcRenderer.invoke('pieMenu.execute', pieTask),

  // ---------------------- On ----------------------
});

contextBridge.exposeInMainWorld('electronAPI', {
  openInBrowser: (url) => ipcRenderer.invoke('openInBrowser', [url]),
  getVersion: () => ipcRenderer.invoke('getVersion'),
  openPieMenu: (callback) => ipcRenderer.on('openPieMenu', (event, pieMenuId) => {callback(pieMenuId)}),
  getSetting: (settingName) => ipcRenderer.invoke('getSetting', [settingName]),
  setSetting: (settingName, value) => ipcRenderer.invoke('setSetting', [settingName, value]),

  // TODO: change name
  openDialogForResult: (defaultPath, filter) => ipcRenderer.invoke('openDialogForResult', [defaultPath, filter]),
  getPieTaskAddons: () => ipcRenderer.invoke('getPieTaskAddons'),
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
