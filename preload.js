const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('params', {
  names: () => ipcRenderer.invoke('names'),
  versions: () => ipcRenderer.invoke('versions'),
  dependencies: () => ipcRenderer.invoke('dependencies'),
  mainfiles: () => ipcRenderer.invoke('mainfiles'),
  devDependencies: () => ipcRenderer.invoke('devDependencies'),
  descriptions: () => ipcRenderer.invoke('descriptions')
});