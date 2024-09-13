import { app as electronApp, BrowserWindow } from 'electron';
import path from 'path';
import expressApp from './server/server.mjs'; 
import { __dirname } from './pathUtil.mjs'; 

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL('http://localhost:3000');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

electronApp.on('ready', () => {
    createWindow();

    expressApp.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
});

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electronApp.quit();
    }
});

electronApp.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
