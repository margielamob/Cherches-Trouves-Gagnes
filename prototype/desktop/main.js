// main.js
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1422,
        height: 800,
    });

    mainWindow.loadFile(`${__dirname}/dist/client/index.html`);
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});