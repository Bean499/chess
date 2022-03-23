$("#surrender").click(() => {
    if (game.p1Turn) {
        game.whiteCheckmate = true;
    }
    else {
        game.blackCheckmate = true;
    }
})

$("#post-game").hide()