import { App, BrowserWindow, ipcMain } from "electron";
import JSONStorage from "./storage.json";
import fs from "fs";

//@TODO - finish this
//@TODO - do the same with cli (a lot better)
//@TODO - mediator pattern on algo repo

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
        const pathString = "./htmls/index.html";
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
            console.log('[MAIN] ', `Writing to JSON file storage...`);
            fs.writeFile("./compiled/storage.json", JSON.stringify(data), (err) => {
                if (err) console.log(err)
            });
            try {
                fs.writeFile("./src/storage.json", JSON.stringify(data), (err) => {
                    if (err) console.log(err)
                });
            } catch (e) {
                console.log(e);
            }
        });

        ipcMain.on('resize', (event, dimension) => {
            console.log('[MAIN] ', `Resizing window to dimensions ${JSON.stringify(dimension)}...`);
            this.__w.setSize(dimension.width, dimension.height)
        });


        ipcMain.on('error', (event, error) => {
            console.log('[ERROR - WEB PAGE] ', error);
        });

    }
}