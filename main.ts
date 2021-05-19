import {app, BrowserWindow, screen, Menu, dialog, Notification  } from 'electron';
import * as path from 'path';
import * as url from 'url';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import { autoUpdater } from 'electron-updater';
const log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.file = __dirname + 'log.log';

// Initialize remote module
require('@electron/remote/main').initialize();

const updateUrl = `https://github.com/anhtoanhd/smart-gate/releases/download/v${app.getVersion()}/`;

autoUpdater.setFeedURL(
    {
        provider: 'generic',
        url: 'http://count.smart-one.io/download'
    }
);
// {
//     provider: 'github',
//         host: 'github.com',
//     protocol: 'https',
//     owner: 'anhtoanhd',
//     private: true,
//     token: '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',
//     releaseType: 'release',
//     publisherName: ['VNIT'],
//     publishAutoUpdate: true
// }

autoUpdater.checkForUpdates().then().catch(error => {
    log.error(error);
    const notification = new Notification({
        title: 'Update available',
        body: `${error}`

    });
    notification.show();
    throw error;
});

autoUpdater.on('update-available', info => {
    log.info(info);
    console.log('Update available');
    const notification = new Notification({
        title: 'Update available',
        body: 'Updates are Available !! Click here to install'

    });
    notification.show();
});

autoUpdater.on('update-not-available', info => {
    log.info(info);
    console.log('Not update available');
    const notification = new Notification({
        title: 'Not update available',
        body: 'No updates are Available !!'

    });
    notification.show();
});

autoUpdater.addListener('update-downloaded', () => {
    const notification = new Notification({
        title: 'Steady Readers',
        body: 'Updates are Available !! Click here to install'

    });
    notification.on('click', () => {
        const res = dialog.showMessageBox(win, {
            type: 'question',
            title: 'Steady Readers'
            , message: 'Would you like to close and install update?', buttons: ['Ok', 'Cancel']
        });
        res.then((value) => {
            if (value.response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    });
    notification.show();
});

const isMac = process.platform === 'darwin';
const template: MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'togglefullscreen' },
            { role: 'toggleDevTools' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click: async () => {
                    const { shell } = require('electron');
                    await shell.openExternal('https://electronjs.org');
                }
            },
            {
                label: 'Check for update',
                click: async () => {
                    log.info('Check update click');
                    console.log('Check update click');
                    const notification = new Notification({
                        title: 'Update click',
                        body: 'Update click !!'

                    });
                    notification.on('click', () => {
                        const res = dialog.showMessageBox(win, {
                            type: 'question',
                            title: 'Steady Readers'
                            , message: 'Would you like to close and install update?', buttons: ['Ok', 'Cancel']
                        });
                        res.then((value) => {
                            if (value.response === 0) {
                                autoUpdater.quitAndInstall();
                            }
                        });
                    });
                    notification.show();

                }
            }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

let win: BrowserWindow = null;
const args = process.argv.slice(1),
    serve = args.some(val => val === '--serve');
function createWindow(): BrowserWindow {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        title: 'Smart Gate',
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false,  // false if you want to run 2e2 test with Spectron
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
    });

    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
        win.loadURL('http://localhost:4300');
    } else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/smart-gate/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

    return win;
}

try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => {
        setTimeout(createWindow, 400);
    });

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

} catch (e) {
    // Catch Error
    // throw e;
}
