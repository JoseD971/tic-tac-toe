const GameBoard = (() => {
    const board = Array(9).fill('');

    const get = () => board;

    const reset = () => board.fill('');

    const makePlay = (index, mark) => {
        if (board[index] === '') {
            board[index] = mark;
            DisplayController.updateScreen(index, mark);
            // console.log('Play made!');
            return true;
        } else {
            // console.log('Box not available');
            return false;
        }
    };

    return {get, reset, makePlay}
})();

function Player (name, marker) {
    return {name, marker}
}

const GameFlow = (() => {
    let playerX;
    let playerO;
    let currentPlayer;
    let gameOver;

    const start = (nameX, nameO) => {
        playerX = Player(nameX, 'x');
        playerO = Player(nameO, 'o');
        GameBoard.reset();
        gameOver = false;
        currentPlayer = playerO;
        DisplayController.resetScreen();
    };

    const playRound = (index) => {
        if(gameOver === true) return;
        if(isBoxAvailable(index) == false) return;

        currentPlayer = (currentPlayer == playerX) ? playerO : playerX;
        GameBoard.makePlay(index, currentPlayer.marker);
        // console.log(GameBoard.get());
        if(checkWin()) {
            DisplayController.resultBox.textContent = `Player ${currentPlayer.name} wins!`;
            DisplayController.resultBox.style.color = '#19c95c';
            gameOver = true;
            return;
        }
        if(GameBoard.get().indexOf('') == -1) {
            DisplayController.resultBox.textContent = `It's a draw!`;
            DisplayController.resultBox.style.color = '#f05e1f';
            gameOver = true;
            return;
        }
        
    };

    const isBoxAvailable = (index) => {
        if(GameBoard.get()[index] != '') {
            alert('Box not available. Please select another.');
            return false;
        } else {
            return true;
        }
    }

    const checkWin = () => {
        let board = GameBoard.get();
        let result;
        let winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], 
                            [0, 3, 6], [1, 4, 7], [2, 5, 8],
                            [0, 4, 8], [2, 4, 6]];
        winConditions.some(condition => {
            let [a, b, c] = condition;
            if(board[a] && board[a] === board[b] && board[a] === board[c]) {
                result = true;
            }
        });
        return (result == true) ? true : false;
    }

    const updatePlayerName = (mark, name) => {
        if(mark == 'x') {
            playerX.name = name;
        } else {
            playerO.name = name;
        }
    }   

    return {start, playRound, updatePlayerName}
})();

const DisplayController = (() => {
    const startButton = document.getElementById('start-button');
    const boxes = document.querySelectorAll('.board div');
    const resultBox = document.getElementById('round-result');
    const playerNameButtons = document.querySelectorAll('.add-name');
    const cancelButton = document.getElementById('cancel');
    const favDialog = document.getElementById('player-dialog');
    const formPlayer = document.getElementById('player-info');
    const confirmBtn = document.getElementById('player-name-button');
    const nameInput = document.getElementById('player-name-input');

    startButton.addEventListener('click', GameFlow.start);
    boxes.forEach(box => {
        box.addEventListener('click', () => {
            const cellIndex = parseInt(box.getAttribute('cellIndex'));
            GameFlow.playRound(cellIndex);
            (box.textContent != '') ? box.classList.add('activated') : box.classList.remove('activted');
        });
    });
    playerNameButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            favDialog.showModal();
            confirmBtn.setAttribute('player', btn.getAttribute('player'));
            confirmBtn.addEventListener('click', setPlayerName);
        });
    });
    cancelButton.addEventListener('click', function () {
        favDialog.close();
    });

    const resetScreen = () => {
        boxes.forEach(box => {
            box.textContent = '';
            box.classList.remove('activated');
        });
        resultBox.textContent = '';

    }

    const updateScreen = (index, mark) => {
        let selectedBox = document.querySelector(`[cellIndex="${index}"]`);
        if (mark == 'x') {
            selectedBox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-thick</title><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" /></svg>';
        } else {
            selectedBox.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>hexagon</title><path d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z" /></svg>';
        }
    }

    const setPlayerName = () => {
        let mark = confirmBtn.getAttribute('player');
        GameFlow.updatePlayerName(mark, nameInput.value);
        const nameLayer = document.querySelector(`.player-name[player="${mark}"]`);
        nameLayer.textContent = nameInput.value;
        formPlayer.reset();
        cancelButton.click();
    }

    return {updateScreen, resultBox, setPlayerName, resetScreen}
})();


document.addEventListener('DOMContentLoaded', GameFlow.start('Player X', 'Player O'));