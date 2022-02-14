class Pawn extends Piece {
    constructor(white, x, y) {
        super(1, "pawn", white, x, y);
    }

    movePattern() {
        let moves = [[1, 0]];
        if (!this.hasMoved) {
            moves.push([2,0]);
        }
        //The base moves are for black pawns
        if (this.white) {   //If the pawn is instead white
            for (let i = 0; i < moves.length; i++) {
                //Flip the vertical component of each move
                moves[i][0] = moves[i][0] * -1;
            }
            //White pawns move up the board
            //Don't forget the bottom row of the board
            //is index 7 in the 2D array!
        }
        return moves
    }

    killPattern() {
        let moves = [[1, -1], [1, 1]];  //Pawns take diagonally
        //The base moves are for black pawns
        if (this.white) {   //If the pawn is instead white
            for (let i = 0; i < moves.length; i++) {
                //Flip the vertical component of each move
                moves[i][0] = moves[i][0] * -1;
            }
        }
        return moves
    }
}

class GhostPawn extends Piece { 
    //Only inherits from piece, since no use for pawn properties (doesn't move)
    constructor(white, x, y, originatorY) {
        this.originatorX = x;
        this.originatorY = originatorY;
        super(0, "ghost", white, x, y);
    }
}

class Knight extends Piece {
    constructor(white, x, y) {
        super(3, "knight", white, x, y)
    }

    movePattern() {
        let moves = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
        return moves
    }
}

class Bishop extends Piece {
    constructor(white, x, y) {
        super(3, "bishop", white, x, y);
    }

    movePattern() {
        return this.diagonalMove();
    }
}

class Rook extends Piece {
    constructor(white, x, y) {
        super(5, "rook", white, x, y);
    }

    movePattern() {
        return this.cardinalMove();
    }
}

class Queen extends Piece {
    constructor(white, x, y) {
        super(9, "queen", white, x, y);
    }

    movePattern() {
        let diagonalMoves = this.diagonalMove();
        let cardinalMoves = this.cardinalMove();
        for (let i = 0; i < cardinalMoves.length; i++) {
            diagonalMoves.push(cardinalMoves[i]);
        }
        let moves = diagonalMoves;
        return moves
    }
}
