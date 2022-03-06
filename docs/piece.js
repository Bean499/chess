//Moves are in the format [j,i] which are unit vectors up/right respectively
//Don't forget that the bottom row of the board is index 7
//So negative values of j move upwards, positive values move downwards

function printSortedMoves(list) {
    for (i = 0; i < list.length; i++) {
        for (j = 0; j < list[i].length; j++) {
            for (k = 0; k < list[i][j].length; k++) {
                // console.log(list[i][j][k]);
            }
        }
    }
}

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

    //TESTING UNNEEDED
    movePattern() { }
    //This method is empty since each child
    //class will define it uniquely

    //TESTING UNNEEDED
    killPattern() {                     //Only the pawn class kills differently from moving,
        return this.movePattern();      //so by default this just returns the normal move pattern
    }

    //TESTED PARTIALLY - need to test interaction with ghost pawns
    die(game) {
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
        return game
    }

    //NOT TESTED
    cardinalMove() {
        let moves = [];
        for (let i = 1; i < 8; i++) {
            moves.push([i, 0]);
            moves.push([0, i]);
            moves.push([i * -1, 0]);
            moves.push([0, i * -1]);
        }
        return moves
    }

    //NOT TESTED
    diagonalMove() {
        let moves = [];
        for (let i = 1; i < 8; i++) {
            moves.push([i, i]);
            moves.push([i * -1, i]);
            moves.push([i * -1, i * -1]);
            moves.push([i, i * -1]);
        }
        return moves
    }

    //TESTED PARTIALLY
    move(j, i, game) {
        let valid = false;
        let makeGhost = false;
        for (let x = 0; x < this.getValidMoves(game).length; x++) {
            if (JSON.stringify(this.getValidMoves(game)[x]) == JSON.stringify([j, i])) {
                valid = true;
            }
        }
        if (valid) {
            let newX = this.x + i;
            let newY = this.y + j;
            //Variables for new coordinates
            if (!this.hasMoved) {
                //If this hasn't moves
                if (this.type == "pawn" && Math.abs(j) == 2) {
                    //If this is a pawn moving two spaces
                    makeGhost = true;
                    //Make a ghost pawn at the space it moved from
                }
                else if (this.type == "king" && Math.abs(i) > 1) {
                    //If this is a king and it's castling
                    if (i > 0) {
                        //If going right
                        game = game.board[this.y][this.x + 3].move(0, -2, game);
                        //Move the rook that's to the right
                    }
                    else {
                        //If going left
                        game = game.board[this.y][this.x - 4].move(0, 3, game);
                        //Move the rook that's to the left
                    }
                }
                this.hasMoved = true;
            }
            if (game.board[newY][newX] != null) {
                game = game.board[newY][newX].die(game);
            }
            this.x = newX;
            this.y = newY;
            game.update();
            //Render the new positions of pieces
            if (makeGhost) {
                game.pieces.push(new GhostPawn(this.white, this.x, this.y - 0.5 * j, this.y));
            }
        }
        //When done (or if the move is invalid), return
        return game
    }

    //TESTED FULLY
    removeOOB(moves) {
        let toDelete = [];
        for (let i = 0; i < moves.length; i++) {
            let newX = this.x + moves[i][1];
            let newY = this.y + moves[i][0];
            if (newX > 7 || newX < 0 || newY > 7 || newY < 0) {
                toDelete.push(i);
            }
        }
        if (toDelete.length > 0) {
            for (let i = toDelete.length - 1; i >= 0; i--) {
                //This probably looks like a really weird for loop
                //It goes backwards through the list of items to delete
                //If it went forwards then the indices in toDelete would become
                //invalid due to the items in moves moving forwards, and their
                //indicies changing - going backwards means that this doesn't happen
                moves.splice(toDelete[i], 1);
            }
        }
        return moves
    }

    //TESTED FULLY
    sortMoves(moves) {
        let sortedMoves = new Array(8);
        for (let i = 0; i < 8; i++) {
            sortedMoves[i] = new Array();
        }
        //Ordered clockwise, starting from straight upwards
        //Up, up-right, right, down-right, down, down-left, left, up-left
        //0	  1	        2      3           4     5          6     7
        for (let i = 0; i < moves.length; i++) {
            // console.log("current move:");
            // console.log(i)
            // console.log(moves[i]);
            if (moves[i][0] < 0) {
                if (moves[i][1] < 0) {          //Up Left
                    sortedMoves[7].push(moves[i]);
                    // console.log("up left" + i);
                }
                else if (moves[i][1] == 0) {    //Up
                    sortedMoves[0].push(moves[i]);
                    // console.log("up" + i)
                    // console.log(sortedMoves);
                }
                else {                          //Up right
                    sortedMoves[1].push(moves[i]);
                    // console.log("up right" + i);
                    // console.log(sortedMoves);
                }
            }
            else if (moves[i][0] == 0) {
                if (moves[i][1] < 0) {          //Left
                    sortedMoves[6].push(moves[i]);
                    // console.log("left" + i);
                    // console.log(sortedMoves);
                }
                else if (moves[i][1] == 0) {    //This block should never run!
                    console.log("Uh oh spaghettio");
                }
                else {                          //Right
                    sortedMoves[2].push(moves[i]);
                    // console.log("right" + i)
                    // console.log(sortedMoves);
                }
            }
            else {
                if (moves[i][1] < 0) {          //Down left
                    sortedMoves[5].push(moves[i]);
                    // console.log("down left" + i);
                    // console.log(sortedMoves);
                }
                else if (moves[i][1] == 0) {    //Down
                    sortedMoves[4].push(moves[i]);
                    // console.log("down" + i);
                    // console.log(sortedMoves);
                }
                else {                          //Down right
                    sortedMoves[3].push(moves[i]);
                    // console.log("down right" + i);
                    // console.log(sortedMoves);
                }
            }
        }
        // for (let i = 0; i < 8; i++) {
        //     for (let j = 0; j < sortedMoves[i].length; j++) {

        //     }
        // }
        return sortedMoves
        // return JSON.stringify(sortedMoves)
    }

    //TESTED PARTIALLY - need to test attacking moves
    getValidMoves(game) {
        // console.log(this.movePattern());
        let moves = JSON.stringify(this.sortMoves(this.removeOOB(this.movePattern())));
        moves = JSON.parse(moves);
        let kills = JSON.stringify(this.sortMoves(this.removeOOB(this.killPattern())));
        kills = JSON.parse(kills);
        let validMoves = [];
        if (this.type == "king") {
            // console.log("king");
            kills = null;
            let castle = this.castleCheck(game);
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
        for (let j = 0; j < 8; j++) {
            //For each direction
            let movesToDelete = [];
            let blocked = false;
            if (moves[j] != []) {
                for (let i = 0; i < moves[j].length; i++) {
                    //For each move in current direction
                    // console.log("Current move:");
                    // console.log(moves[j][i]);
                    let newX = this.x + moves[j][i][1];
                    let newY = this.y + moves[j][i][0];
                    if (game.board[newY][newX] != null || blocked) {
                        //If the new space is occupied, or if this direction is blocked
                        // console.log("I think this space is either occupied or the direction is blocked");
                        if (this.type != "knight") {
                            blocked = true;
                        }
                        movesToDelete.push([j, i]);
                    }
                }
            }
            let killsToDelete = [];
            blocked = false
            if (kills != null) {
                if (kills[j] != []) {
                    for (let i = 0; i < kills[j].length; i++) {
                        //For each kill in current direction
                        // console.log("Current kill:");
                        let newX = this.x + kills[j][i][1];
                        let newY = this.y + kills[j][i][0];
                        if (game.board[newY][newX] == null || blocked) {
                            //If the new space isn't occupied, remove the kill
                            //but don't mark the direction as blocked
                            // console.log("I think this space is empty or the direction is blocked")
                            killsToDelete.push([j, i]);
                        }
                        else if (game.board[newY][newX].white == this.white) {
                            //If the new space is occupied by an ally
                            // console.log("I think this direction is blocked by an ally");
                            killsToDelete.push([j, i]);
                            if (this.type != "knight") {
                                blocked = true;
                            }
                            //Mark the direction as blocked and remove the kill
                        }
                        else {
                            //If the new space is occupied by an enemy
                            // console.log("I think this space is occupied by an enemy");
                            if (this.type != "knight") {
                                blocked = true;
                            }
                            //Mark the direction as blocked but don't remove the kill
                        }
                        // console.log(blocked)
                    }
                }
            }
            //Two more backwards for loops, like in Piece.removeOOB
            if (movesToDelete.length > 0) {
                for (let i = movesToDelete.length - 1; i >= 0; i--) {
                    moves[movesToDelete[i][0]].splice(movesToDelete[i][1], 1);
                }
            }
            if (killsToDelete.length > 0) {
                for (let i = killsToDelete.length - 1; i >= 0; i--) {
                    kills[killsToDelete[i][0]].splice(killsToDelete[i][1], 1);
                }
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < moves[i].length; j++) {
                validMoves.push(moves[i][j]);
            }
            if (kills != null) {
                for (let j = 0; j < kills[i].length; j++) {
                    validMoves.push(kills[i][j]);
                }
            }
        }
        return validMoves
    }

    //TESTED FULLY
    renderPiece() {
        if (this.type == "ghost") {
            return
        }
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