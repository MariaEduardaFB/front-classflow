const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Adiciona o electron-reload para recarregar a aplicação automaticamente
require('electron-reload')(path.join(__dirname, 'src'), {
  electron: path.join(__dirname, 'node_modules', '.bin', 'electron') // Caminho para o binário do Electron
});

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'ClassFlow',
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Melhora a segurança
      contextIsolation: true, // Necessário para o preload
    },
    icon: __dirname + '/assets/Icone-ClassFlow.png'
  });

  // Carregar a página inicial (login)
  mainWindow.loadFile('src/pages/login.html');
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Evento para navegação entre páginas
ipcMain.on('navigate', (event, target) => {
  const targetPath = path.join(__dirname, `src/pages/${target}`);
  if (mainWindow) {
    mainWindow.loadFile(targetPath);
  }
});

// Apenas para depuração (exemplo do logMessage)
ipcMain.on('log-message', (event, message) => {
  console.log('Mensagem do front-end:', message);
});
