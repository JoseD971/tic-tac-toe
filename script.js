const GameBoard = (() => {
    const board = Array(9).fill("");

    const get = () => board;

    const reset = () => board.fill("");

    const makePlay = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            console.log("Play made!");
            return true;
        } else {
            console.log("Box not available");
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
    let current;
    let gameOver = false;

    const start = (nameX, nameO) => {
        playerX = Player(nameX, "X");
        playerO = Player(nameO, "O");
        GameBoard.reset();
        current = playerX;
        round();
    };

    const round = (action) => {
        if(gameOver === true) return;

        // const action = prompt();
        GameBoard.makePlay(action, current.marker);
        console.log(GameBoard.get());

        if(GameBoard.get().indexOf("") == -1) {
            gameOver = true;
        }
        
    };

    const isBoxAvailable = () => {

    }

    const checkWin = () => {

    }

    const results = () => {};

    return {start, round, results}
})();

const DisplayController = (() => {

})();

document.addEventListener('DOMContentLoaded', GameFlow.start("Player 1", "Player 2"));