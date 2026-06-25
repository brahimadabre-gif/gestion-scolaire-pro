const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'Gestion Scolaire Pro',
    show: false
  });

  // Charger le fichier HTML local
  mainWindow.loadFile('index.html');

  // Ouvrir les DevTools en mode développement (décommentez pour déboguer)
  // mainWindow.webContents.openDevTools();

  // Afficher la fenêtre quand le contenu est prêt
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Gérer l'impression depuis Electron
  ipcMain.handle('print-page', async () => {
    const { dialog } = require('electron');
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      const pdfPath = path.join(app.getPath('temp'), 'print.pdf');
      await win.webContents.printToPDF({});
    }
  });
}

// Créer la fenêtre quand l'app est prête
app.whenReady().then(createWindow);

// Quitter quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recréer la fenêtre sur macOS quand l'icône est cliquée
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
