require('dotenv').config();
const { app, BrowserWindow } = require('electron');
const path = require('path');

require("electron-reload")(__dirname, {
  // Note that the path to electron may vary according to the main file
  electron: require(`${__dirname}/node_modules/electron`),
});

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });
  
    win.loadFile('index.html');
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});