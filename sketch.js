// SETUP ------------------------------------------------------------------------------------ {{{
//Constant for image directory
const images = "img/"

//Writing this is a pain, so I've put it in a constant
const canvasName = "defaultCanvas0";

//This 2D object will hold the P5Image instances for sprites
var pieceImages = {
    //First sub-object for white pieces
    "white": {
        "pawn": "",
        "knight": "",
        "bishop": "",
        "rook": "",
        "queen": "",
        "king": "",
        "ghost": "",
    },
    //Second sub-object for white pieces
    "black": {
        "pawn": "",
        "knight": "",
        "bishop": "",
        "rook": "",
        "queen": "",
        "king": "",
        "ghost": "",
    },
    //Individual entries for misc sprites
    "selected": "",
    "current": "",
};
// }}}

// P5JS FUNCTIONS ---------------------------------------------------------------------------- {{{
function deselect(game) {
    game.renderSpaces = false;
    game.selectedSpaces = null;
    for (let i = 0; i < game.pieces.length; i++) {
        game.pieces[i].selected = false;
    }
    return game
}

function mousePressed() {
    //Runs when mouse is pressed
    //mouseX and mouseY are co-ordinates relative to top left of canvas
    //If inside the canvas:
    if (0 <= mouseY && mouseY <= 480 && 0 <= mouseX && mouseX <= 480 && !game.promoting) {
        //Check which space mouse is on
        space = [Math.floor(mouseY / 60), Math.floor(mouseX / 60)];
        //If the user clicks on a piece
        if (game.board[space[0]][space[1]] != null) {
            //If no space is selected or if the clicked piece is the same colour as the selected one
            if (game.renderSpaces == false || game.board[space[0]][space[1]].white == game.board[game.renderSpaces[0]][game.renderSpaces[1]].white) {
                //If piece clicked on is unselected and it's that player's turn
                if (!game.board[space[0]][space[1]].selected && game.board[space[0]][space[1]].white == game.p1Turn) {
                    //Deselct every piece
                    game = deselect(game);
                    //Select the piece clicked on
                    game.board[space[0]][space[1]].selected = true;
                    game.renderSpaces = space;
                    game.selectedSpaces = game.board[space[0]][space[1]].getLegalMoves(game);
                    // game.selectedSpaces = game.board[space[0]][space[1]].getLegalMoves(game);
                    // game.selectedSpaces = game.board[space[0]][space[1]].getValidMoves(game);
                }
                //If the piece clicked on is selected
                else if (game.board[space[0]][space[1]].selected) {
                    //Deselect it
                    game = deselect(game);
                }
            }
            //If the user clicks on a piece of the opposite colour of the selected one
            else {
                let j = space[0] - game.renderSpaces[0];
                let i = space[1] - game.renderSpaces[1];
                if (JSON.stringify(game.selectedSpaces).includes(JSON.stringify([j, i]))) {
                    game.board[game.renderSpaces[0]][game.renderSpaces[1]].move(j, i, game);
                    game.p1Turn = !game.p1Turn;
                    game = deselect(game);
                }
            }
        }
        //If the user clicks on an unoccupied space
        else {
            let j = space[0] - game.renderSpaces[0];
            let i = space[1] - game.renderSpaces[1];
            if (JSON.stringify(game.selectedSpaces).includes(JSON.stringify([j, i]))) {
                game.board[game.renderSpaces[0]][game.renderSpaces[1]].move(j, i, game);
                game.p1Turn = !game.p1Turn;
            }
            game = deselect(game);
        }
    }
    //This occurs when the user clicks outside of the board
    //so the only practical use is logging tests.
    //else {
        //OOBtest(game);
    //}
}

function preload() {
    boardImage = loadImage(images + "board.png");
    for (const colour in pieceImages) {
        for (const type in pieceImages[colour]) {
            pieceImages[colour][type] = loadImage(images + type + "_" + colour + ".png");
        }
    };
    pieceImages["selected"] = loadImage(images + "selected.png");
    pieceImages["current"] = loadImage(images + "current.png");

}

function setup() {
    frame = 60;
    frameRate(frame);
    canvas = createCanvas(480, 480);
    background(0, 0, 0);
    canvas.parent("game");   //Put the canvas inside the game div
    var p1 = localStorage.p1Name;
    var p2 = localStorage.p2Name;
    var timer = localStorage.timer;
    game = new Game(timer, p1, p2);

    counter = 0;

    p1Timer = 0;
    p1TimerSeconds = 0;
    p1TimerMinutes = 0;

    p2Timer = 0;
    p2TimerSeconds = 0;
    p2TimerMinutes = 0;

    //TEST GOES HERE
    // legalTest1(game);
}

function draw() {
    //Frame counter
    counter++;
    //If counter == framerate then a second has passed
    if (counter == frame) {
        //Reset frame counter
        counter = 0;
        //Increment current timer
        if (game.p1Turn) p1Timer++;
        else p2Timer++;
    }
    //Calculate remaining time
    p1TimeRemaining = game.timerMax - p1Timer;
    //Calculate minutes and seconds
    p1TimerMinutes = Math.floor(p1TimeRemaining / 60);
    p1TimerSeconds = p1TimeRemaining % 60;
    //Stick a zero in front if seconds in single digits
    if (p1TimerSeconds < 10) p1TimerSeconds = "0" + String(p1TimerSeconds);
    //Make timer into text
    p1TimerText = p1TimerMinutes + ":" + p1TimerSeconds
    //Checkmate if timer is zero
    if (p1TimeRemaining == 0) game.whiteCheckmate = true;

    //Above but for p2
    p2TimeRemaining = game.timerMax - p2Timer;
    p2TimerMinutes = Math.floor(p2TimeRemaining / 60);
    p2TimerSeconds = p2TimeRemaining % 60;
    if (p2TimerSeconds < 10) p2TimerSeconds = "0" + String(p2TimerSeconds);
    p2TimerText = p2TimerMinutes + ":" + p2TimerSeconds
    if (p2TimeRemaining == 0) game.blackCheckmate = true;

    if (game.players[0].name == "quinn") game.whiteCheckmate = true;
    if (game.players[1].name == "quinn") game.blackCheckmate = true;

    if (!game.blackCheckmate && !game.whiteCheckmate) {
        let turn;
        let waiting;
        //Set turn variable
        if (game.p1Turn) {
            turn = "1";
            waiting = "2";
        }
        else {
            turn = "2";
            waiting = "1";
        }
        //Display info
        $("#p1").html(game.players[0].name + " | " + game.players[0].score + " points" + " | " + p1TimerText);
        $("#p2").html(game.players[1].name + " | " + game.players[1].score + " points" + " | " + p2TimerText);
        //Highlight current player
        $("#p" + turn).css("color", "#6a9bff");
        $("#p" + turn).css("font-weight", "bold");
        //Unhighlight inactive player
        $("#p" + waiting).css("color", "#000000");
        $("#p" + waiting).css("font-weight", "normal");
        //Draw board
        image(boardImage, 0, 0);
        //Draw pieces
        game.renderAllPieces();
        //If a piece is selected
        if (game.renderSpaces != false) {
            //Assign elected piece coordinates to current
            let current = game.renderSpaces;
            let selectedSprite = pieceImages["selected"];
            let currentSprite = pieceImages["current"];
            image(currentSprite, game.renderSpaces[1] * 60, game.renderSpaces[0] * 60);
            //For each move the piece can do
            for (i = 0; i < game.selectedSpaces.length; i++) {
                if (game.board[current[0]][current[1]] != null) {
                    //Get x and y coordinates
                    let y = (game.selectedSpaces[i][0] + game.board[current[0]][current[1]].y) * 60;
                    let x = (game.selectedSpaces[i][1] + game.board[current[0]][current[1]].x) * 60;
                    //Place blue circle
                    image(selectedSprite, x, y);
                }
            }
        }
    }
    else {
        //Get name of winning player
        let winner;
        if (game.blackCheckmate) winner = game.players[0].name;
        else winner = game.players[1].name;
        //Empty canvas
        clear();
        //Hide board and show post-game stuff
        $("#in-game").hide();
        $("#post-game").prepend("<h1>" + winner + " wins!!!</h1>");
        $("#post-game").show();
        //Stop draw function from running
        noLoop();
    }
}
// }}}
