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
        let moves = [];
        for (let i = this.x * -1; i < 8 - this.x; i++) {
            if (i != 0) {
                moves.push([0,i]);
            }
        }
        for (let j = this.y * -1; j < 8 - this.x; j++) {
            if (j != 0) {
                moves.push([j,0]);
            }
        }
        return moves
    }

    diagonalMove() {
        let moves = [];
        for (let k = 1; k < 8; k++) {
            for (let horMultiplier = -1; horMultiplier < 2; horMultiplier++) {
                for (let vertMultiplier = -1; vertMultiplier < 2; vertMultiplier++) {
                    if (horMultiplier != 0 && vertMultiplier != 0) {
                    //Makes sure no stationary move is appended
                        let i = k * horMultiplier;
                        let j = k * vertMultiplier;

                        let newX = this.x + i;
                        let newY = this.y + j;

                        if (newX <= 7 && newX >= 0 && newY <= 7 && newY >= 0) {
                            moves.push([j, i]);
                        }
                    }
                }
            }
        }
        return moves
    }

    move (j, i) {
        if (this.getValidMoves().includes([j, i])) {
            let newX = this.x + i;
            let newY = this.y + j;
            if (!this.hasMoved) {
                if (this.type == "pawn" && Math.abs(j) == 2) {
                //If this is a pawn moving two spaces
                    this.createGhostPawn(j);
                    //Make a ghost pawn at the space if moved from
                }
                else if (this.type == "king" && Math.abs(i) > 1) {
                //If this is a king and it's castling
                    if (i > 0) {
                    //If going right
                        game.board[this.y][this.x+3].move(0, -2);
                        //Move the rook that's to the right
                    }
                    else {
                    //If going left
                        game.board[this.y][this.x-4].move(0, 3);
                        //Move the rook that's to the left
                    }
                }
                this.hasMoved = true;
            }
            if (game.board[newY][newX] != null) {
                game.board[newY][newX].die();
            }
            this.x = newX;
            this.y = newY;
            game.board.update();
            //Render the new positions of pieces
        }
    }

    removeOOB(moves) {
        let toDelete = [];
        for (let i = 0; i < moves.length; i++) {
            let newX = this.x + moves[i][1];
            let newY = this.y + moves[i][0];
            if (newX > 7 || newX < 0 || newY > 7 || newY < 0) {
                toDelete.push(moves[i]);
            }
        }
        for (let i = toDelete.length; i >= 0; i--) {
        //This probably looks like a really weird for loop
        //It goes backwards through the list of items to delete
        //If it went forwards then the indices in toDelete would become
        //invalid due to the items in moves moving forwards, and their
        //indicies changing - going backwards means that this doesn't happen
            moves.splice(i, 1);
        }
    }

    sortMoves(moves) {
        let sortedMoves = [[], [], [], [], [], [], [], []];
        //Ordered clockwise, starting from straight upwards
        //Up, up-right, right, down-right, down, down-left, left, up-left
        //0	  1	        2      3           4     5          6     7
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][0] > 0) {
                if (moves[i][1] < 0) {          //Up Left
                    sortedMoves[7].push(moves[i]);
                }
                else if (moves[i][1] == 0) {    //Up
                    sortedMoves[0].push(moves[i]);
                }
                else {                          //Up right
                    sortedMoves[1].push(moves[i]);
                }
            }
            else if (moves[i][0] == 0) {
                if (moves[i][1] < 0) {          //Left
                    sortedMoves[6].push(moves[i]);
                }
                else if (moves[i][1] == 0) {    //This block should never run!
                    console.log("Uh oh spaghettio");
                }
                else {                          //Right
                    sortedMoves[2].push(moves[i]);
                }
            }
            else {
                if (moves[i][1] < 0) {          //Down left
                    sortedMoves[5].push(moves[i]);
                }
                else if (moves[i][1] == 0) {    //Down
                    sortedMoves[4].push(moves[i]);
                }
                else {                          //Down right
                    sortedMoves[3].push(moves[i]);
                }
            }
        }
        return sortedMoves
    }

    getValidMoves() {
        let validMoves = [];
        let moves = this.removeOOB(this.movePattern());
        let kills = this.removeOOB(this.killPattern());
        if (this.type == "knight") {
            return moves
        }
        else if (this.type == "king") {
            let castle = this.castleCheck();
            //Check if the king can castle
            if (castle != []) {
            //If it can:
                for (let i = 0; i < castle.length; i++) {
                    validMoves.push(castle[i]);
                    //Add the castle moves to the validMoves list
                    //(Validation is done in King.castleCheck)
                }
            }
        }
        else {
            //Sort moves into directions
            let moves = sortMoves(moves);
            let kills = sortMoves(kills);
            for (let j = 0; j < 8; j++) {
            //For each direction
                let movesToDelete = [];
                let blocked = false;
                for (let i = 0; i < moves[j].length; i ++); {
                //For each move in current direction
                    let newX = this.x + moves[j][i][1];
                    let newY = this.y + moves[j][i][0];
                    if (game.board[newY][newX] != null || blocked) {
                    //If the new space is occupied, or if this direction is blocked
                        blocked = true;
                        movesToDelete.push(moves[j][i]);
                    }
                }
                let killsToDelete = [];
                blocked = false
                for (let i = 0; i < kills[j].length; i ++); {
                //For each move in current direction
                    let newX = this.x + kills[j][i][1];
                    let newY = this.y + kills[j][i][0];
                    if (game.board[newY][newX] == null || blocked) {
                    //If the new space isn't occupied, remove the kill
                    //but don't mark the direction as blocked
                        movesToDelete.push(moves[j][i]);
                    }
                    else if (game.board[newY][newX].white == this.white) {
                    //If the new space is occupied by an ally
                        killsToDelete.push(moves[j][i]);
                        blocked = true;
                    }
                    else {
                    //If the new space is occupied by an enemy
                        blocked = true;
                        //Mark the direction as blocked but don't remove the kill
                    }
                }
                //Two more backwards for loops, like in Piece.removeOOB
                for (let i = movesToDelete.length; i >= 0; i--) {
                    moves.splice(i, 1);
                }
                for (let i = killsToDelete.length; i >= 0; i--) {
                    kills.splice(i, 1);
                }
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < moves[i].length; j++) {
                validMoves.push(moves[i][j]);
            }
            for (let j = 0; j < kills[i].length; j++) {
                validMoves.push(kills[i][j]);
            }
        }
        return validMoves
    }
    renderPiece() {
        let x = this.x * 60;
        let y = this.y * 60;
        let colour;
        if (this.white) {
            colour = "white";
        }
        else {
            colour = "black";
        }
        let sprite = pieceImages[colour][this.type]; 
        image(sprite, x, y);
    }
}
