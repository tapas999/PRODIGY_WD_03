const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
const vsAI = true;

// Load audio
const moveSound = new Audio('move.mp3');
const winSound = new Audio('win.mp3');
const drawSound = new Audio('draw.mp3');

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function handleClick(e) {
  const index = e.target.dataset.index;

  if (gameBoard[index] !== '' || !gameActive || currentPlayer !== 'X') return;

  makeMove(index, 'X');

  if (gameActive && vsAI) {
    setTimeout(() => {
      const aiIndex = getBestMove();
      makeMove(aiIndex, 'O');
    }, 500);
  }
}

function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('played');
  moveSound.play();

  if (checkWin(player)) {
    statusText.textContent = `Player ${player} wins!`;
    gameActive = false;
    winSound.play();
  } else if (gameBoard.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    drawSound.play();
  } else {
    currentPlayer = player === 'X' ? 'O' : 'X';
    if (!vsAI || currentPlayer === 'X') {
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function checkWin(player) {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return (
      gameBoard[a] === player &&
      gameBoard[b] === player &&
      gameBoard[c] === player
    );
  });
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;

  gameBoard.forEach((val, i) => {
    if (val === '') {
      gameBoard[i] = 'O';
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  });

  return move;
}

function minimax(board, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (board.every(cell => cell !== '')) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let eval = minimax(board, depth + 1, false);
        board[i] = '';
        maxEval = Math.max(maxEval, eval);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let eval = minimax(board, depth + 1, true);
        board[i] = '';
        minEval = Math.min(minEval, eval);
      }
    }
    return minEval;
  }
}

function restartGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Player X's turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('played');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
