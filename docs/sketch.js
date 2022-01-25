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
        canvasName,
    ];

    for (i = 0; i < thingsToHide.length; i++) {
        if (thingsToHide[i] == exclude) {
            $("#"+thingsToHide[i]).show("fade")
        }
        else {
            $("#"+thingsToHide[i]).hide("fade");
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

function preload () {
    boardImage = loadImage(images + "board.png");
    for (const colour in pieceImages) {
        for (const type in pieceImages[colour]) {
            pieceImages[colour][type] = loadImage(images + type + "_" + colour + ".png");
        }
    };
}

function setup () {
    createCanvas(480, 480);
    hide("title");
    game = new Game(700, "Ben", "Nick");
}

function draw() {
    background(0, 0, 0);
    image(boardImage, 0, 0);
    game.renderAllPieces();
}
