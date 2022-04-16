const fs = require("fs");

function readScoreboard() {
    let contents;
    //contents = fs.readFileSync("scoreboard.json", "utf8");
    try {
        contents = fs.readFileSync("scoreboard.json", "utf8");
    }
    catch (err) {
        console.log(err);
        contents = "[]";
    }
    return contents
}

function writeScoreboard(game) {
    //Get current match history
    let history = JSON.parse(readScoreboard());
    //Get which player won
    let p1Win;
    if (game.whiteCheckmate) p1Win = false;
    else p1Win = true;
    //Make a new object to append to the list
    let newGame = {
        "p1": game.players[0].name,
        "p2": game.players[1].name,
        "p1Win": p1Win
    }
    //Add to current match history
    history.push(newGame);
    //Turn into string
    let text = JSON.stringify(history);
    //Write to file
    fs.writeFileSync("scoreboard.json", text);
}

$("#profile-button").click(() => {
    //Get matches
    let matches = JSON.parse(readScoreboard());
    //For each match
    for (i = 0; i < matches.length; i++) {
        let winner;
        //Get name of winner
        if (matches[i]["p1Win"]) winner = matches[i]["p1"];
        else winner = matches[i]["p2"];
        //Empty Table
        $("#match-history").html("<tr><th>Player 1</th><th>Player 2</th><th>Winner</th></tr>");
        //Add row to table
        $("#match-history").append("<tr><<td>" + matches[i]["p1"] + "</td><td>" + matches[i]["p2"] + "</td><td>" + winner + "</td></tr>");
    }
});

$("#save-button").click(() => {
    //Write game to file
    writeScoreboard(game);
    //Self destruct button
    $("#button-container").html("Game saved!");
});
