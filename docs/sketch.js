//Currently this is problematic because I can't open local files.
//Will need to use a hosting website (like Infinity Free) to
//host the game's profile files, otherwise I won't be able to
//save data between sessions (which is very important, since the
//user's name and match history need to be saved).

//Do this later due to above complications
//json = $.getJSON("profile.json", data => console.log(data));

const images = "img/"
const canvasName = "defaultCanvas0";
//Writing this is a pain, so I've put it in a constant

//This object will hold the P5Image instances for sprites
var pieceImages = {
    "white": {
        "pawn": "",
        "knight": "",
        "bishop": "",
        "rook": "",
        "queen": "",
        "king": ""
    },
    "black": {
        "pawn": "",
        "knight": "",
        "bishop": "",
        "rook": "",
        "queen": "",
        "king": ""
    },
    "selected": ""
};

var mode = "game";
var gameMade = false;
var renderSpaces = false;

function hide(exclude) {
    //Hide everything on startup
    let thingsToHide = [
        "title",
        "in-game",
        "join-lobby",
        "create-lobby",
        "lobby",
        "profile",
        "get-name",
        canvasName
    ];

    if (!Array.isArray(exclude)) {
        exclude = [exclude]
    }

    for (let i = 0; i < thingsToHide.length; i++) {
        if (exclude.includes(thingsToHide[i])) {
            $("#" + thingsToHide[i]).show()
        }
        else {
            $("#" + thingsToHide[i]).hide();
        }
    };
}

function main() {
    //Get p1name
    //Get p2name
    //Get timer value from slider
    game = new Game(timer, p1Name, p2Name);
}

$("#create-button").click(() => hide("create-lobby"));
$("#join-button").click(() => hide("join-lobby"));
$("#profile-button").click(() => hide("profile"));


function renderSelectedSpaces(game) {
    if (game.renderSpaces != false) {

    }
}
// }}}

// TESTS ------------------------------------------------------------------------------------- {{{
function ghostpawntest(game) {
    //Not done yet
    game = game.board[6][4].move(2, 0, game);
    game.update();
}

function dietest(game) {
    //Passed
    game = game.board[6][4].die();
    game.update();
}

function OOBtest(game) {
    //Passed
    console.log(game.board[7][1].removeOOB(game.board[7][1].movePattern()));
    console.log(game.board[7][4].removeOOB(game.board[7][4].movePattern()));
}

function sortTest(game) {
    //Passed
    console.log(game.board[7][3].sortMoves(game.board[7][3].movePattern()));
}

function castletest1(game) {
    game.board[7][4].hasMoved = true;
    //Set king to have moved
    game = game.board[7][1].die(game);
    game = game.board[7][2].die(game);
    game = game.board[7][3].die(game);
    //Kill stuff between king and left rook
    game.update();
    console.log(game.board[7][4].castleCheck(game));
}

function castletest2(game) {
    game.board[7][0].hasMoved = true;
    //Set left rook to have moved
    game = game.board[7][1].die(game);
    game = game.board[7][2].die(game);
    game = game.board[7][3].die(game);
    //Kill stuff between king and left rook
    game.update();
    console.log(game.board[7][4].castleCheck(game));
}

function castletest3(game) {
    game = game.board[7][1].die(game);
    game = game.board[7][2].die(game);
    game = game.board[7][3].die(game);
    //Kill stuff between king and left rook
    game.update();
    console.log(game.board[7][4].castleCheck(game));
}

function castletest4(game) {
    console.log(game.board[7][4].castleCheck(game));
}

function validTestKnight(game) {
    console.log(game.board[7][1].getValidMoves(game));
}

function validTestKing(game) {
    console.log(game.board[7][4].getValidMoves(game));
}

function validTestPawn(game) {
    console.log(game.board[6][1].getValidMoves(game));
}

function moveTestPawn(game) {
    game = game.board[6][1].move(-2, 0, game);
    console.log(game.board);
}

function moveTestKnight(game) {
    game = game.board[7][1].move(-2, 1, game);
}

function moveTestCastle(game) {
    game = game.board[7][5].die(game);
    game = game.board[7][6].die(game);
    game.update();
    game = game.board[7][4].move(0, 2, game);
}
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
    if (0 <= mouseY && mouseY <= 480 && 0 <= mouseX && mouseX <= 480) {
        //Check which space mouse is on
        space = [Math.floor(mouseY / 60), Math.floor(mouseX / 60)];
        //If the user clicks on a piece
        if (game.board[space[0]][space[1]] != null) {
            //If no space is selected or if the clicked piece is the same colour as the selected one
            if (game.renderSpaces == false || game.board[space[0]][space[1]].white == game.board[game.renderSpaces[0]][game.renderSpaces[1]].white) {
                //If piece clicked on is unselected
                if (!game.board[space[0]][space[1]].selected) {
                    //Deselct every piece
                    game = deselect(game);
                    //Select the piece clicked on
                    game.board[space[0]][space[1]].selected = true;
                    game.renderSpaces = space;
                    game.selectedSpaces = game.board[space[0]][space[1]].getValidMoves(game);
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
            }
            game = deselect(game);
        }
    }
}

function preload() {
    boardImage = loadImage(images + "board.png");
    for (const colour in pieceImages) {
        for (const type in pieceImages[colour]) {
            pieceImages[colour][type] = loadImage(images + type + "_" + colour + ".png");
        }
    };
    pieceImages["selected"] = loadImage(images + "selected.png");
}

function setup() {
    canvas = createCanvas(480, 480);
    background(0, 0, 0);
    //canvas.parent("in-game");   //Put the canvas inside the in-game div
    //hide(["title",canvasName]);
    game = new Game(700, "Ben", "Nick");
    // moveTestCastle(game);
    console.log(game.board[7][7].getValidMoves(game));
    game.pieces.push(new Pawn(false, 3, 5));
    game.update();
    // console.log(game.board[7][7].movePattern());
    // console.log(game.board[7][7].sortMoves(game.board[7][7].movePattern()));
}

function draw() {
    //Draw board
    image(boardImage, 0, 0);
    //Draw pieces
    game.renderAllPieces();
    //If a piece is selected
    if (game.renderSpaces != false) {
        //Assign elected piece coordinates to current
        let current = game.renderSpaces;
        let sprite = pieceImages["selected"];
        //For each move the piece can do
        for (i = 0; i < game.selectedSpaces.length; i++) {
            //Get x and y coordinates
            let y = (game.selectedSpaces[i][0] + game.board[current[0]][current[1]].y) * 60;
            let x = (game.selectedSpaces[i][1] + game.board[current[0]][current[1]].x) * 60;
            //Place blue circle
            image(sprite, x, y);
        }
    }
}
// }}}