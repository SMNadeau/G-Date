const electron = require('electron');
const { app, BrowserWindow, ipcMain} = electron;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
    mainWindow.on('close', () => app.quit());
});

require('./ipc')