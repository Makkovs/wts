const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('params', {
  projects: () => ipcRenderer.invoke('projects')
});