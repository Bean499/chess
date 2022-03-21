const electron = require("electron");
const $ = require("jquery");
const fs = require("fs");

function readScoreboard() {
    return fs.readFileSync("scoreboard.json", "utf8")
}

function writeScoreboard(json) {
    json = JSON.stringify(json);
    fs.writeFileSync("scoreboard.json", json);
}