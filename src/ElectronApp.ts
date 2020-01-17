import { App, BrowserWindow } from "electron";

export default class ElectronApp {
    app: App;
    __w: BrowserWindow;
    constructor(app: App) {
        this.app = app;
        this.__w;

        this.listen();

    }

    createWindow(path?: string, width?: number, height?: number) {
        if (!path) path = "index";
        if (!width || !height) width = 800, height = 600;
        this.__w = new BrowserWindow({
            width,
            height,
            webPreferences: {
                nodeIntegration: true
            }
        });

        this.__w.loadFile(`${path}.html'`);

        this.__w.on('closed', () => {
            this.__w = null
        });
    }

    listen() {
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
    }
}