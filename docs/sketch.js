//Currently this is problematic because I can't open local files.
//Will need to use a hosting website (like Infinity Free) to
//host the game's profile files, otherwise I won't be able to
//save data between sessions (which is very important, since the
//user's name and match history need to be saved).

//Do this later due to above complications
//json = $.getJSON("profile.json", data => console.log(data));

const server = "https://bean-chess.infinityfreeapp.com";
const images = server + "/htdocs/img/"

//function preload () {
//    var boardImage = loadImage(images + "board.png");
//    var pieceImages = {
//        "white": {
//            "pawn": "",
//            "knight": "",
//            "bishop": "",
//            "rook": "",
//            "queen": "",
//            "king": ""
//        },
//        "black": {
//            "pawn": "",
//            "knight": "",
//            "bishop": "",
//            "rook": "",
//            "queen": "",
//            "king": ""
//        }
//    };
//    for (const colour in pieceImages) {
//        for (const type in pieceImages[colour]) {
//            pieceImages[colour][type] = loadImage(images + type + "_" + colour);
//            console.log("Loaded " + type + colour);
//        }
//    };
//}

function setup () {
    createCanvas(480, 480);
    background(0, 255, 0);
   
    const canvasName = "defaultCanvas0";
    //Writing this is a pain, so I've put it in a constant

    //Hide everything on startup
    thingsToHide = [
        "in-game",
        "join-lobby",
        "create-lobby",
        "lobby",
        "profile",
        "get-name",
    ];

    for (i = 0; i < thingsToHide.length; i++) {
        $("#"+thingsToHide[i]).hide("fade", {}, 0.1);
    };
}

function main() {
    //Get p1name
    //Get p2name
    //Get timer value from slider
    game = new Game(timer, p1Name, p2Name);
}
