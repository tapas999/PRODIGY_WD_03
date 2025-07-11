const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let currentPlayer = 'X'; // Player
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let vsAI = true; // Toggle for AI opponent

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleClick(e) {
  const index = e.target.dataset.index;

  if (gameBoard[index] !== '' || !gameActive || currentPlayer !== 'X') return;

  makeMove(index, 'X');

  if (gameActive && vsAI) {
    setTimeout(aiMove, 500); // Let AI think a bit
  }
}

function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;

  if (checkWin(player)) {
    statusText.textContent = `Player ${player} wins!`;
    gameActive = false;
  } else if (gameBoard.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = player === 'X' ? 'O' : 'X';
    if (!vsAI || currentPlayer === 'X') {
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function aiMove() {
  if (!gameActive) return;

  let available = [];
  gameBoard.forEach((val, i) => {
    if (val === '') available.push(i);
  });

  const aiIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(aiIndex, 'O');
}

function checkWin(player) {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return (
      gameBoard[a] === player &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    );
  });
}

function restartGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player X's turn`;
  cells.forEach(cell => (cell.textContent = ''));
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
