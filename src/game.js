//Import NPM module for prompt function
//(used in pawn promotion in update method)
const Dialogs = require('dialogs');
const dialogs = Dialogs();

class Player {
    constructor(white, name) {
        this.score = 0;         //Scores always start at 0
        this.white = white;
        this.name = name;
    }
}

class Game {
    constructor(timer, p1Name, p2Name, fillBoard = true) {
        this.timerMax = timer;
        this.players = [
            new Player(true, p1Name),
            new Player(false, p2Name)
        ];
        this.p1Turn = true;
        this.pieces = [];

        //Is a piece selected? If so, where?
        this.renderSpaces = false;
        //List of that piece's moves to render
        this.selectedSpaces = null;

        //Neither king starts in checkmate
        this.whiteCheckmate = false;
        this.blackCheckmate = false;

        //Flag for when promoting a piece
        this.promoting = false;

        if (fillBoard) {
            this.newFilledBoard();
        }
    }

    checkmateUpdate() {
        this.whiteCheckmate = this.pieces[0].checkmateCheck(this);
        this.blackCheckmate = this.pieces[1].checkmateCheck(this);
    }

    newEmptyBoard() {
        let board = [];
        for (let i = 0; i < 8; i++) {
            board.push([]);
            for (let j = 0; j < 8; j++) {
                board[i].push(null)
            }
        }
        return board;
    }

    newFilledBoard() {
        this.board = this.newEmptyBoard();

        let kingsQueens = [[true, 7], [false, 0]];
        let rooks = [[true, 0, 7], [true, 7, 7], [false, 0, 0], [false, 7, 0]];
        let knights = [[true, 1, 7], [true, 6, 7], [false, 1, 0], [false, 6, 0]];
        let bishops = [[true, 2, 7], [true, 5, 7], [false, 2, 0], [false, 5, 0]];
        let pawns = [[false, 1], [true, 6]]

        this.pieces.push(new King(kingsQueens[0][0], 4, kingsQueens[0][1]));
        this.pieces.push(new King(kingsQueens[1][0], 4, kingsQueens[1][1]));

        //Appends kings outside of for loop since having both kings at index
        //0 and 1 makes coding the checkmateCheck function easier

        for (let i = 0; i < 2; i++) {
            this.pieces.push(new Queen(kingsQueens[i][0], 3, kingsQueens[i][1]));
            //Last item in Queen constructor is x coordinate, since that doesn't change
            for (let j = 0; j < 8; j++) {
                this.pieces.push(new Pawn(pawns[i][0], j, pawns[i][1]));
            }
        }

        for (let i = 0; i < 4; i++) {
            this.pieces.push(new Rook(rooks[i][0], rooks[i][1], rooks[i][2]));
            this.pieces.push(new Knight(knights[i][0], knights[i][1], knights[i][2]));
            this.pieces.push(new Bishop(bishops[i][0], bishops[i][1], bishops[i][2]));
        }
        this.update();     //Puts the pieces into the board 2D array
    }

    cleanup() {
        let toDelete = [];
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].x == -1 || (this.pieces[i].type == "ghost" && this.pieces[i].white != this.p1Turn)) {
                toDelete.push(i);
            }
        }
        for (let i = toDelete.length - 1; i >= 0; i--) {
            this.pieces.splice(toDelete[i], 1);
        }
    }

    update(actualMove = true) {
        if (actualMove) {
            this.cleanup();
        }
        this.board = this.newEmptyBoard();
        for (let i = 0; i < this.pieces.length; i++) {
            let x = this.pieces[i].x;
            let y = this.pieces[i].y;
            if (x >= 0 && y >= 0) {
                this.board[y][x] = this.pieces[i];
            }
            //Promotion algorithm begins here
            //If this is a pawn
            if (this.pieces[i].type == "pawn") {
                if (actualMove) {
                    //And if it has reached the opposite side of the board
                    if ((this.pieces[i].white && this.pieces[i].y == 0) || (!this.pieces[i].white && this.pieces[i].y == 7)) {
                        //Setting attributes to variable so I
                        //don't need to keep writing this.pieces[i]
                        let colour = this.pieces[i].white;
                        let x = this.pieces[i].x;
                        let y = this.pieces[i].y;

                        //Things that can get added to the pieces array
                        let objects = {
                            "queen": new Queen(colour, x, y),
                            "rook": new Rook(colour, x, y),
                            "bishop": new Bishop(colour, x, y),
                            "knight": new Knight(colour, x, y)
                        };

                        //Prompt popup, defaults to queen
                        this.promoting = true;
                        dialogs.prompt(
                            "What type of piece should your pawn become?",
                            "queen",
                            (value => {
                                console.log(value)
                                let promote = value.toLowerCase();
                                //If the thing the user entered isn't a key in the object
                                if (!JSON.stringify(Object.keys(objects)).includes(promote)) {
                                    //Default to queen
                                    promote = "queen";
                                }
                                //Add the new piece to the array
                                this.pieces.push(objects[promote]);
                                //Kill the pawn
                                this.pieces[i].die(this, false);
                                //Update promoting flag
                                this.promoting = false;
                                //Update
                                this.update();
                            })
                        );
                    }
                }
            }
        }
        if (actualMove) {
            this.checkmateUpdate();
        }
        // console.log(this.pieces);
        this.renderAllPieces()
    }

    renderAllPieces(renderGhosts = false) {
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].renderPiece(renderGhosts);
        }
    }
}
