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

    //This function may be obselete. Adding castle moves to the above function has been done,
    //which partially deprecates this function. To wholly replace it, make sure to add the
    //castle check to the Piece.move() function, as currently there is no implementation
    //of the rook moving alongside a king when castling.
    castle(j, i) {
        moves = [];
        if (!this.hasMoved) {
            if (!game.board[this.y][this.x + 3].hasMoved) {
                if (game.board[this.x+1][this.y] == null && game.board[this.x+2][this.y] == null) {
                    
                }
            }
        }    
    }

    checkCheck() {
        check
    }    
}
