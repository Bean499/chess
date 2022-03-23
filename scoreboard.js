// const electron = require("electron");
const fs = require("fs");

function readScoreboard() {
    return fs.readFileSync("scoreboard.json", "utf8")
}

function writeScoreboard(game) {
    let history = JSON.parse(readScoreboard());
    let p1Win;
    if (game.whiteCheckmate) {
        p1Win = false;
    }
    else {
        p1Win = true;
    }
    let newGame = {
        "p1": game.players[0].name,
        "p2": game.players[1].name,
        "p1Win": p1Win
    }
    history.push(newGame);
    let text = JSON.stringify(history);
    fs.writeFileSync("scoreboard.json", text);
}

$("#profile-button").click(() => {
    let matches = JSON.parse(readScoreboard());
    for (i = 0; i < matches.length; i++) {
        let winner;
        if (matches[i]["p1Win"]) {
            winner = matches[i]["p1"];
        }
        else {
            winner = matches[i]["p2"];
        }
        $("#match-history").append("<tr><<td>" + matches[i]["p1"] + "</td><td>" + matches[i]["p2"] + "</td><td>" + winner + "</td></tr>");
    }
});

$("#save-button").click(() => {
    writeScoreboard(game);
    console.log(readScoreboard());
    $("#button-container").html("Game saved!");
});