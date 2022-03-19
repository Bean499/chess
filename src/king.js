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
        if (!this.hasMoved) {
            //If the king hasn't moved (necessary for castle)
            console.log(this.y);
            console.log(this.x);
            console.log(game);
            console.log(game.bo)
            if (game.board[this.y][this.x + 3] != null) {
                if (!game.board[this.y][this.x + 3].hasMoved) {
                    //If the rook to the right of the king hasn't moved
                    if (game.board[this.y][this.x + 1] == null && game.board[this.y][this.x + 2] == null) {
                        //If the spaces between the two are empty
                        moves.push([0, 2]);
                        //Add the castle to the list of moves
                    }
                }
            }
            if (game.board[this.y][this.x - 4] != null) {
                if (!game.board[this.y][this.x - 4].hasMoved) {
                    //Repear above for rook to the left of the king
                    if (game.board[this.y][this.x - 1] == null && game.board[this.y][this.x - 2] == null && game.board[this.y][this.x - 3] == null) {
                        moves.push([0, -2]);
                    }
                }
            }
        }
        console.log("hi")
        return moves
    }

    checkCheck(game) {
        let check = false;
        for (let i = 0; i < game.pieces.length; i++) {
            if (this.white != game.pieces[i].white && game.pieces[i].type != "king" && game.pieces[i].type != "ghost") {
                // console.log("current piece:");
                // console.log([game.pieces[i].y, game.pieces[i].x]);
                //Tried to use i/j for move but ended up
                //overwriting count variable. Whoops!
                let x = this.x - game.pieces[i].x;
                let y = this.y - game.pieces[i].y;
                let vector = [y, x];
                // console.log(vector);
                // console.log(game.pieces[i].getValidMoves(game))
                if (JSON.stringify(game.pieces[i].getValidMoves(game)).includes(JSON.stringify(vector))) {
                    check = true;
                }
            }
        }
        return check
    }

    checkmateCheckOld(game) {
        let check = false;
        //These if statements exist because the white king is always index 0
        //in the game.pieces array, and the black king is always index 1.
        //This consistency is the easiest way to check for checkmate.
        let index;
        if (this.white) {
            index = 0;
        }
        else {
            index = 1;
        }
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (!check) {
                    let tempgame = game;
                    tempgame.pieces[index].move(j, i);
                    check = tempgame.pieces[index].checkCheck();
                }
            }
        }
        return check
    }

    checkmateCheck(game) {
        let checkmate = true;
        let allmoves = [];
        for (let i = 0; i < game.pieces.length; i ++) {
            if (game.pieces[i].type != "ghost" && game.pieces[i].white == this.white) {
                console.log(game.pieces[i], "at", game.pieces[i].y, game.pieces[i].x)
                if (JSON.stringify([]) != JSON.stringify(game.pieces[i].getLegalMoves(game))) {
                    checkmate = false;
                }
            }
        }
        console.log(allmoves)
        return checkmate
    }
}
