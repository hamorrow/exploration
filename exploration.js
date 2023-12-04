const rows = 6;
const columns = 6;
const gameBoard = document.getElementById('gameBoard');
let currentPlayer = 'red';

function createBoard() {
    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let c = 0; c < columns; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.column = c;
            row.appendChild(cell);
        }
        gameBoard.appendChild(row);
    }
}

function dropPiece(col) {
    // Find the first empty cell in the column
    for (let r = rows - 1; r >= 0; r--) {
        const cell = gameBoard.children[r].children[col];
        if (!cell.classList.contains('occupied')) {
            cell.classList.add('occupied', currentPlayer);
            togglePlayer();
            break;
        }
    }
}

function togglePlayer() {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
}

createBoard();