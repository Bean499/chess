class Player {
    constructor(white, name) {
        this.score = 0;         //Scores always start at 0
        this.white = white;
        this.name = name;
    }
}

class Game {
    constructor(timer, p1Name, p2Name) {
        this.timerMax = timer;
        this.timerCurrent = 0;
        this.players = [
            new Player(true, p1Name),
            new Player(false, p2Name)
        ];
        this.p1Turn = true;
        this.pieces = [];
        this.board = this.newFilledBoard();
    }

    newEmptyBoard() {
        board = [];
        for (i = 0; i < 8; i++) {
            board.append([]);
            for (j = 0; j < 8; j++) {
                board[i].append(null)
            }
        }
        return board;
    }

    newFilledBoard() {
        this.board = this.newEmptyBoard();

        kingsQueens = [[true, 7], [false, 0]];
        rooks = [[true, 7, 0], [true, 7, 7], [false, 0, 0], [false, 0, 7]];
        knights = [[true, 7, 1], [true, 7, 6], [false, 0, 1], [false, 0, 6]];
        bishops = [[true, 7, 2], [true, 7, 5], [false, 0, 2], [false, 0, 5]];
        pawns = [[false, 1], [true, 6]]

        this.pieces.append(new King(kingsQueens[0][0], kingsQueens[0][1], 4));
        this.pieces.append(new King(kingsQueens[1][0], kingsQueens[1][1], 4));

        //Appends kings outside of for loop since having both kings at index
        //0 and 1 makes coding the checkmateCheck function easier

        for (i = 0; i < 2; i++) {
            this.pieces.append(new Queen(kingsQueens[i][0], kingsQueens[i][1], 3));
            //Last item in Queen constructor is x coordinate, since that doesn't change
            for (j = 0; j < 8; j++) {
                pieces.append(new Pawn(pawns[i][0], pawns[i][1], j));
            }
        }

        for (i = 0; i < 4; i++) {
            this.pieces.append(new Rook(rooks[i][0], rooks[i][1], rooks[i][2]));
            this.pieces.append(new Knight(knights[i][0], knights[i][1], knights[i][2]));
            this.pieces.append(new Bishop(bishop[i][0], bishop[i][1], bishop[i][2]));
        }

        this.updateBoard();     //Puts the pieces into the board 2D array
    }

    cleanup() {
        toDelete = [];
        for (i = 0; i < game.pieces.length; i++) {
            if (game.pieces[i].x == -1 || (game.pieces[i].type == "ghost" && game.pieces[i].white == game.p1Turn)) {
                toDelete.append(game.pieces[i]);
            }
        }
        for (i = 0; i < toDelete.length; i++) {
            game.pieces.splice(i, 1);
        }
    }

    update() {
        this.cleanup();
        this.board = this.newEmptyBoard();
        for (i = 0; i < game.pieces.length; i++) {
            x = game.pieces[i].x;
            y = game.pieces[i].y;
            this.board[y][x] = game.pieces[i];
        }
    }

    function renderAllPieces () {
        for (i = 0; i < this.pieces.length; i++) {
            this.pieces[i].renderPiece();
        }
    }
}
