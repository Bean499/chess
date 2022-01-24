class King extends Piece {
    constructor(white, x, y) {
        super(99, "king", white, x, y);
        //Kings don't really have a points value, so they have 99
    }
    
    //May want to partically redo this function
    //This validation should really take place in Piece.getValidMoves()
    //So you can just stick the castle moves in the moves list
    //and then the validation will remove them if needed
    movePattern() {
        moves = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
    
        //The below checks whether the king can castle, and if so, adds the appropriate moves to the list
        if (!this.hasMoved) {   //King must not have moved to be able to castle
            if (!game.board[this.y][this.x + 3].hasMoved) {     //Check if right rook has moved
                if (game.board[this.x + 1][this.y] == null && game.board[this.x + 2][this.y] == null) {
                //If spaces inbetween are unobstructed
                    moves.append([0, 2]);   //Append castle move
                }
            } 
            if (!game.board[this.y][this.x - 4].hasMoved) {     //Repeat the above for left rook
                if (game.board[this.x - 1][this.y] == null && game.board[this.x - 2][this.y] == null && ) {
                    moves.append([0, -2]);
                }
            }
        }
        return moves
    }

    //This function checks which directions, if any, the king can castle in.
    //I've put it here instead of in Piece.getValidMoves to avoid clutter,
    //since that function is already really massive as it is.
    castleCheck() {
        moves = [];
        if (!this.hasMoved) {
            if (!game.board[this.y][this.x+3].hasMoved) {
                if (game.board[this.y][this.x+1] == null && game.board[this.y][this.x+2] == null) {
                    moves.append([0,2]);
                }
            }
            if (!game.board[this.y][this.x-4].hasMoved) {
                if (game.board[this.y][this.x-1] == null && game.board[this.y][this.x-2] == null && gameboard[this.y][this.x-3] == null) {
                    moves.append([0,-2]);
                }
            }
        }
        return moves
    }

    checkCheck() {
        check = false;
        for (i = 0; i < game.pieces.length; i++) {
            if (this.white != game.pieces[i].white) {
                //Tried toy use i/j for move but ended up
                //overwriting count variable. Whoops!
                x = this.x - game.pieces[i].x;
                y = this.y - game.pieces[i].y;
                vector = [y, x];
                if (game.pieces[i].getValidMoves().includes(vector)) {
                    check = true;
                }
            }
        }
        return check
    }

    checkmateCheck() {
        check = false;
        //These if statements exist because the white king is always index 0
        //in the game.pieces array, and the black king is always index 1.
        //This consistency is the easiest way to check for checkmate.
        if (this.white) {
            index = 0;
        }
        else {
            index = 1;
        }
        for (i = -1; i <= 1; i++) {
            for (j = -1; j <= 1; j++) {
                if (!check) {
                    tempgame = game;
                    tempgame.pieces[index].move(j, i);
                    check = tempgame.pieces[index].checkCheck();
                }
            }
        }
        return check
    }
}
