const electron = require("electron");
const $ = require("jquery");
const fs = require("fs");

const BrowserWindow = electron.remote.BrowserWindow;

function readScoreboard() {
    return fs.readFileSync("scoreboard.json", "utf8")
}

function writeScoreboard(json) {
    json = JSON.stringify(json);
    fs.writeFileSync("scoreboard.json", json);
}

$("#scoreboard").click(() => {
    win.webContents.executeJavaScript('const path = require("path");'
    + 'const fs = require("fs");'
    + 'fs.readFile(path.join(__dirname, "./scoreboard.json"), '
    + '{encoding: "utf-8"}, function(err, data) {'
    + 'if (!err) { console.log("received data: " + data); }'
    + 'else { console.log(err); } });', true)
    .then(console.log('JavaScript Executed Successfully'));
});

$("#write-scoreboard").click(() => {

});