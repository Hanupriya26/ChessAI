var board,
    game = new Chess();

/*The "AI" part starts here */

var calculateBestMove = function(game) {

    var newGameMoves = game.moves();
    var nextMove = "";
    var data = {};
    data.game = game.fen();

    //to recieve move to be played
    var xhttpr = new XMLHttpRequest();
    xhttpr.open("POST","/curpos", false);
    xhttpr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhttpr.onreadystatechange = function() {
        if (xhttpr.readyState == 4) {
            nextMove = xhttpr.responseText;
            //console.log(nextMove);
       }
    };
    xhttpr.send(JSON.stringify(data));
    
    /*
    async function ajaxCall(){
        //ajax request to send board to backend
        var res = "";
        await $.ajax({
            url: "/curpos",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json;charset=UTF-8",
            success: function (data) {
                res = data;
                //console.log(res);
            },
            error: function(data){
                console.log(data);
            }
        });
        return res;
    }

    ajaxCall().then( function(data,err){
		nextMove = data.substring(1,5);
        console.log(nextMove);
        return nextMove;
    });
    */
    
    console.log(nextMove.substring(1,5));
    return nextMove.substring(1,5);
    //return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];
};

/* board visualization and games state handling starts here*/

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.move(bestMove, {sloppy : true});
    board.position(game.fen());
    renderMoveHistory(game.history());
    if (game.game_over()) {
        alert('Game over');
    }
};

var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }
    var bestMove = calculateBestMove(game);
    return bestMove;
};

var renderMoveHistory = function (moves) {
    var historyElement = $('#move-history').empty();
    historyElement.empty();
    for (var i = 0; i < moves.length; i = i + 2) {
        historyElement.append('<span>' + moves[i] + ' ' + ( moves[i + 1] ? moves[i + 1] : ' ') + '</span><br>')
    }
    historyElement.scrollTop(historyElement[0].scrollHeight);

};

var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    renderMoveHistory(game.history());
    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);