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
        if (checkRowFinish() || checkColFinish() || checkDiagFinish()) {
            playable = false;
            return 'finish';
        }

        if (checkDrawFinish()) {
            playable = false;
            return 'draw';
        }

        return 'playing'
        
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
    
    let currentPlayer = playerOne;

    const placeSymbol = function(cell) {
        if (cell.textContent === '' && gameBoard.isPlayable()) {
            cell.textContent = currentPlayer.symbol;
            let result = gameBoard.placeSymbol(cell, currentPlayer);
            switch (result) {
                case 'draw':
                    msg.textContent = "It's a Draw!";
                    break;
                case 'finish':
                    msg.textContent = currentPlayer.name + ' has won the game!'
                    break;
                case 'playing':
                    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
                    msg.textContent = currentPlayer.name + ' plays with ' + currentPlayer.symbol;        
            }
        }
    }

    const restartGame = function() {
        currentPlayer = playerOne;
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