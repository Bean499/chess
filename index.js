const { app, BrowserWindow } = require("electron");
function createWindow () {
    const window = new BrowserWindow({
        width: 1600,
        height:900,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadFile("index.html");
}
app.whenReady().then(createWindow);
