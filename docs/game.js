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
        this.newFilledBoard();
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
            if (this.pieces[i].x == -1 || (this.pieces[i].type == "ghost" && this.pieces[i].white == this.p1Turn)) {
                toDelete.push(i);
            }
        }
        for (let i = toDelete.length - 1; i >= 0; i--) {
            this.pieces.splice(toDelete[i], 1);
        }
    }

    update() {
        this.cleanup();
        this.board = this.newEmptyBoard();
        for (let i = 0; i < this.pieces.length; i++) {
            let x = this.pieces[i].x;
            let y = this.pieces[i].y;
            this.board[y][x] = this.pieces[i];
        }
        this.renderAllPieces();
    }

    renderAllPieces() {
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].renderPiece();
        }
    }
}
