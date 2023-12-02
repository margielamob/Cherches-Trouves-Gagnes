/* eslint-disable no-unused-vars */
// main.js
const { app, BrowserWindow, ipcMain } = require('electron');

let windows = [];

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        width: 1920,
        height: 1080,
    });

    mainWindow.on('closed', () => {
        if (windows.length === 2) {
            windows[1].close();
        }
    });

    windows.push(mainWindow);
    mainWindow.loadFile(`${__dirname}/dist/client/index.html`);
};

const createChatWindow = (arg) => {
    const chatWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
        fullscreenable: false,
        fullscreen: false,
        autoHideMenuBar: true,
        resizable: false,
        width: 500,
        height: 700,
    });

    chatWindow.removeMenu();

    chatWindow.on('closed', () => {
        windows[0].webContents.send('attach', { isRoomSelected: false, isSearchSelected: false });
        windows.pop();
    });

    windows.push(chatWindow);
    chatWindow.loadURL(`file://${__dirname}/dist/client/index.html#/detached`);
    chatWindow.webContents.on('did-finish-load', () => {
        const data = arg;
        chatWindow.webContents.send('chatData', data);
    });
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

ipcMain.on('createChatWindow', (_event, arg) => {
    createChatWindow(arg);
});

//------------------
// Messages sent from detached chat
//------------------
ipcMain.on('selectRoom', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('selectRoom', arg);
    }
});

ipcMain.on('deselectRoom', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('deselectRoom', arg);
    }
});

ipcMain.on('sendMessage', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('sendMessage', arg);
    }
});

ipcMain.on('fetchUserRooms', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('fetchUserRooms', arg);
    }
});

ipcMain.on('fetchAllRooms', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('fetchAllRooms', arg);
    }
});

ipcMain.on('fetchMessages', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('fetchMessages', arg);
    }
});

ipcMain.on('createRoom', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('createRoom', arg);
    }
});

ipcMain.on('joinRooms', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('joinRooms', arg);
    }
});

ipcMain.on('leaveRoom', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('leaveRoom', arg);
    }
});

ipcMain.on('deleteRoom', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('deleteRoom', arg);
    }
});

// ipcMain.on('attach', (_event, arg) => {
//     if (windows.length === 2) {
//         windows[0].webContents.send('attach', arg);
//     }
// });

ipcMain.on('focus-chat', (_event, _arg) => {
    if (windows.length === 2) {
        windows[1].focus();
    }
});

ipcMain.on('close-chat', (_event, _arg) => {
    if (windows.length === 2) {
        windows[1].close();
    }
});

ipcMain.on('attach', (_event, arg) => {
    if (windows.length === 2) {
        windows[0].webContents.send('attach', arg);
        windows[1].close();
    }
});

//------------------
// Messages sent from main window
//------------------
ipcMain.on('detach', (_event, arg) => {
    createChatWindow(arg);
});

ipcMain.on('sync-detached', (_event, arg) => {
    if (windows.length === 2) {
        windows[1].webContents.send('sync-detached', arg);
    }
});

ipcMain.on('language', (_event, arg) => {
    if (windows.length === 2) {
        windows[1].webContents.send('language', arg);
    }
});

ipcMain.on('theme', (_event, arg) => {
    if (windows.length === 2) {
        windows[1].webContents.send('theme', arg);
    }
});
