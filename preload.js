const { contextBridge, ipcRenderer } = require('electron');

// Exposer des API sécurisées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Fonction d'impression via Electron
  printPage: () => ipcRenderer.invoke('print-page'),
  
  // Informations sur l'app
  getAppVersion: () => '1.0.0',
  getPlatform: () => process.platform
});
