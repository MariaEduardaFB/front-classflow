const { contextBridge } = require('electron');

// Expor APIs ao front-end
contextBridge.exposeInMainWorld('electronAPI', {
  logMessage: (message) => console.log('Mensagem do Electron:', message),
});
