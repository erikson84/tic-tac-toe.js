"use strict"

const board = document.querySelector('.board');
const resetButton = document.querySelector('div.button>button');
const msg = document.querySelector('h2.msg');

board.addEventListener('click', placeSymbol);
resetButton.addEventListener('click', resetBoard);

const gameBoard = (function() {
    let playable = true;

    const arrayBoard = [['_', '_', '_'],
                        ['_', '_', '_'],
                        ['_', '_', '_']];
    
    const checkRows = function(board) {
        return board.
                map(row => row.every(cell => cell === row[0] && row[0] !== '_')).
                    some(row => row === true);
    };

    const checkRowFinish = function() {
        return checkRows(arrayBoard);
    };

    const checkColFinish = function() {
        const transposeArray = arrayBoard[0].
            map((_, idx) => arrayBoard.map(row => row[idx]));
        return checkRows(transposeArray);
    }

    const checkDiagFinish = function() {
        return (arrayBoard[0][0] === arrayBoard[1][1] &&
                arrayBoard[0][0] === arrayBoard[2][2] &&
                arrayBoard[0][0] !== '_') || 
                (arrayBoard[0][2] === arrayBoard[1][1] &&
                arrayBoard[0][2] === arrayBoard[2][0] &&
                arrayBoard[0][2] !== '_')
    }

    const checkDrawFinish = function() {
        return arrayBoard.map(row => row.every(cell => cell !== '_')).
                            every(result => result === true);
    }
    
    const checkFinish = function() {
        if (checkDrawFinish()) {
            msg.textContent = "It's a draw!";   
            playable = false;
            return false;
        }

        if (checkRowFinish() || checkColFinish() || checkDiagFinish()) {
            playable = false;
            return true;
        }
        
    }

    const placeSymbol = function(cell, player) {
        const position = cell.dataset.cell;
        let [a, b] = position.split('').map(coord => +coord);
        arrayBoard[a][b] = player.symbol;
        return checkFinish();
    };

    const resetBoard = function () {
        arrayBoard.forEach(row => row.forEach((cell, idx, arr) => {
            arr[idx] = '_';
        }))
        playable = true;
    };

    const isPlayable = function() {
        return playable;
    };

    return {placeSymbol, resetBoard, isPlayable};
})();

const gameFlow = (function() {
    
    const Player = function(name, symbol) {
        return {name, symbol}
    };

    const playerOne = Player('Player One', '✕');
    const playerTwo = Player('Player Two', '◯')
    
    const players = [playerOne, playerTwo];

    let currentPlayerIdx = 0;
    let player = players[currentPlayerIdx];

    const placeSymbol = function(cell) {
        if (cell.textContent === '' && gameBoard.isPlayable()) {
            cell.textContent = player.symbol;
            let result = gameBoard.placeSymbol(cell, player);
            if (result) {
                msg.textContent = player.name + ' has won the game!'
                return
            }
            currentPlayerIdx = currentPlayerIdx ? 0 : 1;
            player = players[currentPlayerIdx];
            msg.textContent = player.name + ' plays with ' + player.symbol;
        }
    }

    const restartGame = function() {
        currentPlayerIdx = 0;
        player = players[currentPlayerIdx];
    }

    return {placeSymbol, restartGame}
})();

function placeSymbol(e) {
    const cell = e.target;
    gameFlow.placeSymbol(cell);
}

function resetBoard() {
    board.childNodes.forEach(div => div.textContent = '');
    msg.textContent = "Player One starts with ✕";
    gameBoard.resetBoard();
    gameFlow.restartGame();
}