class King extends Piece {
    constructor(white, x, y) {
        super(99, "king", white, x, y);
        //Kings don't really have a points value, so they have 99
    }

    //May want to partically redo this function
    //This validation should really take place in Piece.getValidMoves()
    //So you can just stick the castle moves in the moves list
    //and then the validation will remove them if needed
    movePattern(game) {
        let moves = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
        return moves
    }

    //This function checks which directions, if any, the king can castle in.
    //I've put it here instead of in Piece.getValidMoves to avoid clutter,
    //since that function is already really massive as it is.
    castleCheck(game) {
        let moves = [];
        //If the king hasn't moved (necessary for castle)
        if (!this.hasMoved) { 
            //If the space 3 to the right isn't empty
            if (game.board[this.y][this.x + 3] != null) {
                //If the rook to the right of the king hasn't moved
                if (!game.board[this.y][this.x + 3].hasMoved) {
                    //If the spaces between the two are empty
                    if (game.board[this.y][this.x + 1] == null && game.board[this.y][this.x + 2] == null) {
                        //Add the castle to the list of moves
                        moves.push([0, 2]);
                    }
                }
            }
            //Repeat above for rook to the left of the king
            if (game.board[this.y][this.x - 4] != null) {
                if (!game.board[this.y][this.x - 4].hasMoved) {
                    if (game.board[this.y][this.x - 1] == null && game.board[this.y][this.x - 2] == null && game.board[this.y][this.x - 3] == null) {
                        moves.push([0, -2]);
                    }
                }
            }
        }
        return moves
    }

    checkCheck(game) {
        //Assume king is not in check
        let check = false;
        //For each piece
        for (let i = 0; i < game.pieces.length; i++) {
            //If it's a different colour to this king and it's not a king or a ghost 
            if (this.white != game.pieces[i].white && game.pieces[i].type != "king" && game.pieces[i].type != "ghost") {
                //Get coords of this king relative to current piece
                let x = this.x - game.pieces[i].x;
                let y = this.y - game.pieces[i].y;
                //Put into array
                let vector = [y, x];
                //If array is in the current piece's moves
                if (JSON.stringify(game.pieces[i].getValidMoves(game)).includes(JSON.stringify(vector))) {
                    //The king is in check
                    check = true;
                }
            }
        }
        return check
    }

    checkmateCheck(game) {
        //Assume the king is in checkmate
        let checkmate = true;
        //For each piece
        for (let i = 0; i < game.pieces.length; i++) {
            //If it's not a ghost and it's the same colour as this king
            if (game.pieces[i].type != "ghost" && game.pieces[i].white == this.white) {
                //If this piece has any legal moves
                if (JSON.stringify([]) != JSON.stringify(game.pieces[i].getLegalMoves(game))) {
                    //Checkmate is false
                    checkmate = false;
                }
            }
        }
        return checkmate
    }
}
