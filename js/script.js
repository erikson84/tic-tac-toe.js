"use strict"

const board = document.querySelector('.board');
const resetButton = document.querySelector('footer>button');

board.addEventListener('click', placeSymbol);
resetButton.addEventListener('click', resetBoard);

const gameBoard = (function() {
    const arrayBoard = [['_', '_', '_'],
                        ['_', '_', '_'],
                        ['_', '_', '_']];
    
    const checkRowFinish = function() {
        const cond = arrayBoard.
            map(row => row.every(cell => cell === row[0] && row[0] !== '_')).
                some(row => row === true);
        console.log('Row finish: '+cond);
        return cond
    }

    const checkColFinish = function() {
        
    }
    
    const checkFinish = function() {
        checkRowFinish();
    }

    const placeSymbol = function(cell, player) {
        const position = cell.dataset.cell;
        let [a, b] = position.split('').map(coord => +coord);
        arrayBoard[a][b] = player.symbol;
        console.table(arrayBoard);
        checkFinish();
    };

    const resetBoard = function () {
        arrayBoard.forEach(row => row.forEach((cell, idx, arr) => {
            arr[idx] = '_';
        }))
    }

    return {placeSymbol, resetBoard};
})();

const gameFlow = (function() {
    
    const Player = function(name, symbol) {
        return {name, symbol}
    };

    const playerOne = Player('Player One', 'X');
    const playerTwo = Player('Player Two', 'O')
    
    const players = [playerOne, playerTwo];

    let currentPlayer = 0;

    const placeSymbol = function(cell) {
        if (cell.textContent === '') {
            cell.textContent = players[currentPlayer].symbol;
            gameBoard.placeSymbol(cell, players[currentPlayer]);
            currentPlayer = currentPlayer ? 0 : 1;
        }
    }

    const restartGame = function() {
        currentPlayer = 0;
    }

    return {placeSymbol, restartGame}
})();

function placeSymbol(e) {
    const cell = e.target;
    gameFlow.placeSymbol(cell);
}

function resetBoard() {
    board.childNodes.forEach(div => div.textContent = '');
    gameBoard.resetBoard();
    gameFlow.restartGame();
}