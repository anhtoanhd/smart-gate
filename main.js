"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var electron_updater_1 = require("electron-updater");
var log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.file = __dirname + 'log.log';
// Initialize remote module
require('@electron/remote/main').initialize();
var updateUrl = "https://github.com/anhtoanhd/smart-gate/releases/download/v" + electron_1.app.getVersion() + "/";
electron_updater_1.autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'http://count.smart-one.io/download'
});
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
electron_updater_1.autoUpdater.checkForUpdates().then().catch(function (error) {
    log.error(error);
    var notification = new electron_1.Notification({
        title: 'Update available',
        body: "" + error
    });
    notification.show();
    throw error;
});
electron_updater_1.autoUpdater.on('update-available', function (info) {
    log.info(info);
    console.log('Update available');
    var notification = new electron_1.Notification({
        title: 'Update available',
        body: 'Updates are Available !! Click here to install'
    });
    notification.show();
});
electron_updater_1.autoUpdater.on('update-not-available', function (info) {
    log.info(info);
    console.log('Not update available');
    var notification = new electron_1.Notification({
        title: 'Not update available',
        body: 'No updates are Available !!'
    });
    notification.show();
});
electron_updater_1.autoUpdater.addListener('update-downloaded', function () {
    var notification = new electron_1.Notification({
        title: 'Steady Readers',
        body: 'Updates are Available !! Click here to install'
    });
    notification.on('click', function () {
        var res = electron_1.dialog.showMessageBox(win, {
            type: 'question',
            title: 'Steady Readers',
            message: 'Would you like to close and install update?', buttons: ['Ok', 'Cancel']
        });
        res.then(function (value) {
            if (value.response === 0) {
                electron_updater_1.autoUpdater.quitAndInstall();
            }
        });
    });
    notification.show();
});
var isMac = process.platform === 'darwin';
var template = [
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
                click: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var shell;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                shell = require('electron').shell;
                                return [4 /*yield*/, shell.openExternal('https://electronjs.org')];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }
            },
            {
                label: 'Check for update',
                click: function () { return __awaiter(void 0, void 0, void 0, function () {
                    var notification;
                    return __generator(this, function (_a) {
                        log.info('Check update click');
                        console.log('Check update click');
                        notification = new electron_1.Notification({
                            title: 'Update click',
                            body: 'Update click !!'
                        });
                        notification.on('click', function () {
                            var res = electron_1.dialog.showMessageBox(win, {
                                type: 'question',
                                title: 'Steady Readers',
                                message: 'Would you like to close and install update?', buttons: ['Ok', 'Cancel']
                            });
                            res.then(function (value) {
                                if (value.response === 0) {
                                    electron_updater_1.autoUpdater.quitAndInstall();
                                }
                            });
                        });
                        notification.show();
                        return [2 /*return*/];
                    });
                }); }
            }
        ]
    }
];
var menu = electron_1.Menu.buildFromTemplate(template);
electron_1.Menu.setApplicationMenu(menu);
var win = null;
var args = process.argv.slice(1), serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        title: 'Smart Gate',
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: (serve) ? true : false,
            contextIsolation: false,
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
    });
    if (serve) {
        win.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4300');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/smart-gate/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    // Emitted when the window is closed.
    win.on('closed', function () {
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
    electron_1.app.on('ready', function () {
        setTimeout(createWindow, 400);
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
//# sourceMappingURL=main.js.map