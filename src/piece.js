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

    //TESTING UNNEEDED
    movePattern() { }
    //This method is empty since each child
    //class will define it uniquely

    //TESTING UNNEEDED
    killPattern() {                     //Only the pawn class kills differently from moving,
        return this.movePattern();      //so by default this just returns the normal move pattern
    }

    //TESTED PARTIALLY - need to test interaction with ghost pawns
    die(game, points = true, actualMove = true) {
        if (this.type == "ghost" && actualMove) {     //If ghost pawn (En Passant)
            //If it's not owned by the current player (has been actively killed)
            if (game.p1Turn != this.white) {
                //Kill the originator
                game.board[this.originatorY][this.originatorX].die(game);   
            }
        }
        if (points) {
            if (!this.white) {  //If black piece
                game.players[0].score += this.points;   //Give points to white
            }
            else {              //If white piece
                game.players[1].score += this.points;   //Give points to black
            }
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
    move(j, i, game, actualMove = true, valid = false, points = true, append = true) {
        let makeGhost = false;
        if (!valid) {
            for (let x = 0; x < this.getLegalMoves(game).length; x++) {
            // for (let x = 0; x < this.getValidMoves(game).length; x++) {
                if (JSON.stringify(this.getLegalMoves(game)[x]) == JSON.stringify([j, i])) {
                // if (JSON.stringify(this.getValidMoves(game)[x]) == JSON.stringify([j, i])) {
                    valid = true;
                }
            }
        }
        if (valid) {
            let newX = this.x + i;
            let newY = this.y + j;
            //Variables for new coordinates
            if (!this.hasMoved) {
                //If this hasn't moved
                if (this.type == "pawn" && Math.abs(j) == 2 && actualMove) {
                    //If this is a pawn moving two spaces
                    makeGhost = true;
                    //Make a ghost pawn at the space it moved from
                }
                else if (this.type == "king" && Math.abs(i) > 1 && actualMove) {
                    //If this is a king and it's castling
                    if (i > 0) {
                        //If going right
                        game = game.board[this.y][this.x + 3].move(0, -2, game, true, true, true, false);
                        //Move the rook that's to the right
                    }
                    else {
                        //If going left
                        game = game.board[this.y][this.x - 4].move(0, 3, game, true, true, true, false);
                        //Move the rook that's to the left
                    }
                }
                this.hasMoved = true;
            }
            //If the new space isn't empty and is an enemy
            if (game.board[newY][newX] != null && game.board[newY][newX].white != this.white) {
                //Kill it
                game = game.board[newY][newX].die(game, points, actualMove);
            }
            this.x = newX;
            this.y = newY;
            //Render the new positions of pieces
            game.update(actualMove);
            //If flag for ghost pawn is active, make one
            if (makeGhost) {
                game.pieces.push(new GhostPawn(this.white, this.x, this.y - 0.5 * j, this.y));
            }
            //If the move is to be put in the timeline
            if (append) {
                let columns = [
                    "a",
                    "b",
                    "c",
                    "d",
                    "e",
                    "f",
                    "g",
                    "h"
                ];
                let move = "";
                //If castle
                if (this.type == "king" && Math.abs(i) > 1) {
                    if (i > 0) {
                        move = "0-0";
                    }
                    else {
                        move = "0-0-0";
                    }
                }
                //Otherwise
                else {
                    //Add the piece's letter
                    if (this.type == "knight") {
                        move = move + "N";
                    }
                    else if (this.type != "pawn") {
                        move = move + this.type.charAt(0).toUpperCase();
                    }
                    //Then add the co-ords
                    move = move + columns[newX];
                    move = move + (8 - newY);
                }
                //Determine this piece's colour (for the HTML class
                //so that white's moves are blue and black's are black)
                let colour;
                if (this.white) {
                    colour = "white";
                }
                else {
                    colour = "black";
                }
                //Append the HTML
                $("#timeline").append('<span class="' + colour + '">' + move + "  </span>");
            }
        }
        //When done (or if the move is invalid), return
        return game
    }

    //TESTED FULLY
    removeOOB(moves) {
        let toDelete = [];
        //For each move
        for (let i = 0; i < moves.length; i++) {
            //Get new co-ords
            let newX = this.x + moves[i][1];
            let newY = this.y + moves[i][0];
            //If out of the board (2D array) index
            if (newX > 7 || newX < 0 || newY > 7 || newY < 0) {
                //Add to list to delete
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
        //Initialise 2D array of directions
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
        //Get moves and kills
        let moves = JSON.stringify(this.sortMoves(this.removeOOB(this.movePattern())));
        moves = JSON.parse(moves);
        let kills = JSON.stringify(this.sortMoves(this.removeOOB(this.killPattern())));
        kills = JSON.parse(kills);
        let validMoves = [];
        //If it's a king
        if (this.type == "king") {
            let castle = this.castleCheck(game);
            //If castle moves are available
            if (castle != []) {
                //For each one
                for (let i = 0; i < castle.length; i++) {
                    validMoves.push(castle[i]);
                    //Add the castle moves to the validMoves list
                }
            }
        }
        //For each direction
        for (let j = 0; j < 8; j++) {
            //This bit gets rid of moves that are occupied
            //or blocked by another piece in front of it
            let movesToDelete = [];
            let blocked = false;
            if (moves[j] != []) {
                //For each move in current direction
                for (let i = 0; i < moves[j].length; i++) {
                    //Get new co-ords
                    let newX = this.x + moves[j][i][1];
                    let newY = this.y + moves[j][i][0];
                    //If the new space is occupied, or if this direction is blocked
                    if (game.board[newY][newX] != null || blocked) {
                        //If it's not a knight
                        if (this.type != "knight") {
                            //Mark direction as blocked
                            blocked = true;
                        }
                        //If destination space is occupied
                        if (game.board[newY][newX] != null) {
                            //If not occuppied by a ghost pawn
                            //(this if statement allows pieces to move
                            //onto spaces occupied by ghost pawns)
                            if (game.board[newY][newX].type != "ghost") {
                                //Mark move for deletion
                                movesToDelete.push([j, i]);
                            }
                        }
                        //If destination space is unoccupied
                        //(meaning that this outer if statement
                        //was triggered by blocked == true)
                        else {
                            //Delete it
                            movesToDelete.push([j, i]);
                        }
                    }
                }
            }
            //From here it's similar to the above but with killing moves,
            //so empty spaces are rejected but occupied spaces are accepted
            let killsToDelete = [];
            blocked = false
            //If the current direction has any kills in it
            if (kills[j] != []) {
                //For each kill in current direction
                for (let i = 0; i < kills[j].length; i++) {
                    let newX = this.x + kills[j][i][1];
                    let newY = this.y + kills[j][i][0];
                    //If the new space isn't occupied
                    if (game.board[newY][newX] == null || blocked) {
                        //Remove the kill but don't mark the direction as blocked
                        killsToDelete.push([j, i]);
                    }
                    //If the new space is occupied by an ally
                    else if (game.board[newY][newX].white == this.white) {
                        //Remove the kill and mark direction as blocked
                        killsToDelete.push([j, i]);
                        if (this.type != "knight") {
                            blocked = true;
                        }
                    }
                    //If the new space is occupied by an enemy
                    else {
                        //Mark the direction as blocked but don't remove the kill
                        if (this.type != "knight") {
                            blocked = true;
                        }
                    }
                }
            }
            //Remove stuff that needs removing
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
        //Combine moves and kills arrays into one array called validMoves
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

    getLegalMoves(game) {
        //This method takes the moves from getValidMoves and then
        //checks whether any would put the king in check.
        let validMoves = JSON.stringify(this.getValidMoves(game));
        validMoves = JSON.parse(validMoves);
        let king;
        //Get index in pieces array of allied king
        if (this.white) {
            king = 0;
        }
        else {
            king = 1;
        }
        //Store if this piece has moved & original co-ords
        //(tests whether king get sput in check by actually
        //performing the move, so these will be restored later)
        let moved = this.hasMoved;
        let originalY = this.y;
        let originalX = this.x;
        //Array of moves to delete
        let toDelete = [];
        //Get co-ords of king
        let kingX = game.pieces[king].x;
        let kingY = game.pieces[king].y;

        //For each move in valid moves:
        for (let move = 0; move < validMoves.length; move++) { 
            //Get move vectors
            let i = validMoves[move][1];
            let j = validMoves[move][0];
            //Get new location
            let newX = this.x + i;
            let newY = this.y + j;
            //Flag for whether a piece is killed (important
            //to restore any killed pieces)
            let kill = false;
            if (game.board[newY][newX] != null) {
                kill = true;
            }
            //If this is a king then the co-ordinates of the king
            //will change when it moves. This reflects that.
            if (this.type == "king") {
                kingX = newX;
                kingY = newY;
            }
            //Tests the move - uses various flags to stop things from running
            //No cleanup, yes checked to be valid, don't award points, don't add to timeline
            game = this.move(j, i, game, false, true, false, false);
            //If this move would put the king in check:
            if (game.board[kingY][kingX].checkCheck(game)) {
                //Add this move's index to the delete array
                toDelete.push(move);
            }
            //If a piece was killed
            if (kill) {
                //For each piece
                for (i = 0; i < game.pieces.length; i++) {
                    //If it is marked for death
                    if (game.pieces[i].x < 0 && game.pieces[i].y < 0) {
                        //Restore original co-ordinates
                        game.pieces[i].y = newY;
                        game.pieces[i].x = newX;
                    }
                }
            }
            //Restore this piece's original details
            this.x = originalX;
            this.y = originalY;
            this.hasMoved = moved;
        }
        //Originally this for loop incremented - write about it?
        //Also disappearing queen - this routine doesn't account for moves that kill
        //Delete each move in the array
        for (let i = toDelete.length - 1; i >= 0; i--) {
            validMoves.splice(toDelete[i], 1);
        }
        //Update the board, but don't remove ghost pawns
        game.update(false);
        return validMoves
    }

    //TESTED FULLY
    renderPiece() {
        //Don't render ghosts
        if (this.type.includes("ghost")) {
            return
        }
        //Get coordinates of square in canvas
        let x = this.x * 60;
        let y = this.y * 60;
        //Get the colour of this piece
        let colour;
        if (this.white) {
            colour = "white";
        }
        else {
            colour = "black";
        }
        //Pick the appropriate sprite from the sprites dictionary
        let sprite = pieceImages[colour][this.type];
        //P5JS image function that renders the image
        image(sprite, x, y);
    }
}