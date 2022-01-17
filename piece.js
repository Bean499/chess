//Moves are in the format [j,i] which are unit vectors up/right respectively
//Don't forget that the bottom row of the board is index 7
//So negative values of j move upwards, positive values move downwards

class Piece {
    constructor(points, type, white, x, y) {
        this.points = points;
        this.type = type;
        this.white = white;
        this.x = x;
        this.y = y;

        this.hasMoved = false;      //These values always start as false
        this.selected = false;      //A new piece isn't selected and has never moved
    }

    movePattern() { }   //This method is empty since each child
                        //class will define it uniquely

    killPattern() {                     //Only the pawn class kills differently from moving,
        return this.movePattern();      //so by default this just returns the normal move pattern
    }

    die() {
        if (this.type == "ghost") {     //If ghost pawn (En Passant)
            if (game.p1Turn != this.white) {    //If it's not owned by the current player
                                                //(has been actively killed)
                game.board[this.originatorY][this.originatorX].die();   //Kill the originator
            }
        }
        if (!this.white) {  //If black piece
            game.players[0].score += this.points;   //Give points to white
        }
        else {              //If white piece
            game.players[1].score += this.points;   //Give points to black
        }
        this.x = -1;    //Negative coordinates mark a piece
        this.y = -1;    //for death (see Game.cleanup method)
    }
    
    cardinalMove() {
        moves = [];
        for (i = this.x * -1; i < 8 - this.x; i++) {
            if (i != 0) {
                moves.append([0,i]);
            }
        }
        for (j = this.y * -1; j < 8 - this.x; j++) {
            if (j != 0) {
                moves.append([j,0]);
            }
        }
        return moves
    }

    diagonalMove() {
        moves = [];
        for (k = 1; k < 8) {
            for (horMultiplier = -1; horMultiplier < 2; horMultiplier++) {
                for (vertMultiplier = -1; vertMultiplier < 2; vertMultiplier++) {
                    if (horMultiplier != 0 && vertMultiplier != 0) {
                    //Makes sure no stationary move is appended
                        i = k * horMultiplier;
                        j = k * vertMultiplier;

                        newX = this.x + i;
                        newY = this.y + j;

                        if (newX <= 7 && newX >= 0 && newY <= 7 && newY >= 0) {
                            moves.append([j, i]);
                        }
                    }
                }
            }
        }
        return moves
    }

    move(j, i) {
        if (this.getValidMoves().includes([j, i])) {
            newX = this.x + i;
            newY = this.y + j;
            if (!this.hasMoved) {
                if (this.type == "pawn" && Math.abs(j) == 2) {
                //If this is a pawn moving two spaces
                    this.createGhostPawn(j);
                    //Make a ghost pawn at the space if moved from
                }
                this.hasMoved = true;
            }
            if (game.board[newY][newX] != null) {
                game.board[newY][newX].die();
            }
            this.x = newX;
            this.y = newY;
            game.board.update();
        }
    }

    removeOOB(moves) {
        toDelete = [];
        for (i = 0; i < moves.length; i++) {
            newX = this.x + moves[i][1];
            newY = this.y + moves[i][0];
            if (newX > 7 || newX < 0 || newY > 7 || newY < 0) {
                toDelete.append(moves[i]);
            }
        }
        for (i = 0; i < toDelete.length; i++) {
            moves.splice(i, 1);
        }
    }

    sortMoves(moves) {
        sortedMoves = [[], [], [], [], [], [], [], []];
        //Ordered clockwise, starting from straight upwards
        //Up, up-right, right, down-right, down, down-left, left, up-left
        //0	  1	        2      3           4     5          6     7
        for (i = 0; i < moves.length; i++) {
            if (moves[i][0] > 0) {
                if (moves[i][1] < 0) {          //Up Left
                    sortedMoves[7].append(moves[i]);
                }
                else if (moves[i][1] == 0) {    //Up
                    sortedMoves[0].append(moves[i]);
                }
                else {                          //Up right
                    sortedMoves[1].append(moves[i]);
                }
            }
            else if (moves[i][0] == 0) {
                if (moves[i][1] < 0) {          //Left
                    sortedMoves[6].append(moves[i]);
                }
                else if (moves[i][1] == 0) {    //This block should never run!
                    console.log("You should never see thig");
                }
                else {                          //Right
                    sortedMoves[2].append(moves[i]);
                }
            }
            else {
                if (moves[i][1] < 0) {          //Down left
                    sortedMoves[5].append(moves[i]);
                }
                else if (moves[i][1] == 0) {    //Down
                    sortedMoves[4].append(moves[i]);
                }
                else {                          //Down right
                    sortedMoves[3].append(moves[i]);
                }
            }
        }
        return sortedMoves
    }

    getValidMoves() {
        //Do it later
    }
}
