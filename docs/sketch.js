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
    }
};

var mode = "game";
var gameMade = false;

function hide (exclude) {
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
            $("#"+thingsToHide[i]).show()
        }
        else {
            $("#"+thingsToHide[i]).hide();
        }
    };
}

function main () {
    //Get p1name
    //Get p2name
    //Get timer value from slider
    game = new Game(timer, p1Name, p2Name);
}

$("#create-button").click(() => hide("create-lobby"));
$("#join-button").click(() => hide("join-lobby"));
$("#profile-button").click(() => hide("profile"));

function ghostpawntest(game) {
    game = game.board[6][4].move(2, 0, game);
    game.update();
}

function preload () {
    boardImage = loadImage(images + "board.png");
    for (const colour in pieceImages) {
        for (const type in pieceImages[colour]) {
            pieceImages[colour][type] = loadImage(images + type + "_" + colour + ".png");
        }
    };
}

function setup () {
    canvas = createCanvas(480, 480);
    background(0, 0, 0);
    //canvas.parent("in-game");   //Put the canvas inside the in-game div
    //hide(["title",canvasName]);
    game = new Game(700, "Ben", "Nick");
    console.log(game.board);
    ghostpawntest(game);
    console.log(game.players);
}

function draw() {
    image(boardImage, 0, 0);
    game.renderAllPieces();
}
