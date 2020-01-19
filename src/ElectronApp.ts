import { App, BrowserWindow, ipcMain } from "electron";
import JSONStorage from "../storage.json";
import fs from "fs";

export default class ElectronApp {
    private app: App;
    private __w: BrowserWindow;
    private width: number;
    private height: number;
    constructor(app: App, width: number, height: number) {
        this.app = app;
        this.__w;
        this.width = width;
        this.height = height;

        this.listen();
    }

    private createWindow = () => {
        const pathString = "../../htmls/index.html";
        this.__w = new BrowserWindow({
            width: this.width,
            height: this.height,
            resizable: false,
            // frame: false,
            webPreferences: {
                nodeIntegration: true
            }
        });
        this.__w.loadFile(pathString);
        this.__w.removeMenu();

        this.__w.on('closed', () => {
            this.__w = null
        });
    }

    private listen() {
        this.app.on('ready', this.createWindow);

        this.app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                this.app.quit();
            }
        });

        this.app.on('activate', () => {
            if (this.__w === null) {
                this.createWindow();
            }
        });

        ipcMain.on('log', (event, arg) => {
            console.log('[WEB_PAGE] - ', arg);
            // event.returnValue = 'pong';
        });

        ipcMain.on('getJSON', (event, arg) => {
            event.reply("receive", JSONStorage);
        });

        ipcMain.on('writeFile', (event, data) => {
            console.log('[MAIN] ',`No user with the data provided, creating...`);
            fs.writeFile("./storage.json", JSON.stringify(data), (err) => {
                if (err) console.log(err)
            });
        });

        ipcMain.on('error', (event, error) => {
            console.log('[ERROR - WEB PAGE] ', error);
        });

    }
}