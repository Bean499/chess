// TESTS ------------------------------------------------------------------------------------- {{{
function ghostpawntest(game) {
    //Not done yet
    game = game.board[6][4].move(2, 0, game);
    game.update();
}

function dietest(game) {
    //Passed
    game = game.board[6][4].die();
    game.update();
}

function OOBtest(game) {
    //Passed
    console.log(game.board[7][1].removeOOB(game.board[7][1].movePattern()));
    console.log(game.board[7][4].removeOOB(game.board[7][4].movePattern()));
}

function sortTest(game) {
    //Passed
    console.log(game.board[7][3].sortMoves(game.board[7][3].movePattern()));
}

function castletest1(game) {
    game.board[7][4].hasMoved = true;
    //Set king to have moved
    game = game.board[7][1].die(game);
    game = game.board[7][2].die(game);
    game = game.board[7][3].die(game);
    //Kill stuff between king and left rook
    game.update();
    console.log(game.board[7][4].castleCheck(game));
}

function castletest2(game) {
    game.board[7][0].hasMoved = true;
    //Set left rook to have moved
    game = game.board[7][1].die(game);
    game = game.board[7][2].die(game);
    game = game.board[7][3].die(game);
    //Kill stuff between king and left rook
    game.update();
    console.log(game.board[7][4].castleCheck(game));
}

function castletest3(game) {
    game = game.board[7][1].die(game);
    game = game.board[7][2].die(game);
    game = game.board[7][3].die(game);
    //Kill stuff between king and left rook
    game.update();
    console.log(game.board[7][4].castleCheck(game));
}

function castletest4(game) {
    console.log(game.board[7][4].castleCheck(game));
}

function validTestKnight(game) {
    console.log(game.board[7][1].getValidMoves(game));
}

function validTestKing(game) {
    console.log(game.board[7][4].getValidMoves(game));
}

function validTestPawn(game) {
    console.log(game.board[6][1].getValidMoves(game));
}

function moveTestPawn(game) {
    game = game.board[6][1].move(-2, 0, game);
    console.log(game.board);
}

function moveTestKnight(game) {
    game = game.board[7][1].move(-2, 1, game);
}

function moveTestCastle(game) {
    game = game.board[7][5].die(game);
    game = game.board[7][6].die(game);
    game.update();
    game = game.board[7][4].move(0, 2, game);
}

function checkTest(game) {
    game.board[0][3].white = true;
    check = game.board[0][4].checkCheck(game);
    return check
}

function cloneTest1(game) {
    var copy = Object.assign(
        Object.create(
            Object.getPrototypeOf(game)
        ),
        game
    );
    copy = copy.board[1][0].move(1, 0, clone);
    console.log(game);
    console.log(copy);
}

function cloneTest2(game) {
    clone = new Game(game.timerMax, game.players[0].name, game.players[1].name);
    clone.pieces = game.pieces;
    clone.update();
    clone = clone.board[1][0].move(1, 0, clone, false);
    console.log(game);
    console.log(clone);
}

function cloneTest3(game) {
    pieces = [];
    for (i = 0; i < game.pieces.length; i++) {
        current = game.pieces[i];
        if (current.type == "pawn") {
            pieces.push(new Pawn(current.white, current.x, current.y));
        }
        else if (current.type == "king") {
            pieces.push(new King(current.white, current.x, current.y));
        }
        else if (current.type == "queen") {
            pieces.push(new Queen(current.white, current.x, current.y));
        }
        else if (current.type == "rook") {
            pieces.push(new Rook(current.white, current.x, current.y));
        }
        else if (current.type == "bishop") {
            pieces.push(new Bishop(current.white, current.x, current.y));
        }
        else if (current.type == "knight") {
            pieces.push(new Knight(current.white, current.x, current.y));
        }
        else {
            pieces.push(new GhostPawn(current.white, current.x, current.y, current.originatorY));
        }
    }
    clone = new Game(game.timerMax, game.p1Name, game.p2Name);
    clone.pieces = pieces;
    clone.update();
    clone = clone.board[1][0].move(1, 0, clone, false);
    console.log(game);
    console.log(clone);
}

function legalTest1(game) {
    console.log(game.board[1][0].getLegalMoves(game));
}
// }}}