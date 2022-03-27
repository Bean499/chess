$("#surrender").click(() => {
    if (game.p1Turn) {
        game.whiteCheckmate = true;
    }
    else {
        game.blackCheckmate = true;
    }
})

$("#back-button").click(() => window.location.href = "./index.html");

$("#post-game").hide()