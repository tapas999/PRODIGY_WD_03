const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const themeBtn = document.getElementById('themeBtn');

let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let currentMode = 'ai'; // Default mode is Player vs AI


const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Click Handler
cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

function handleClick(e) {
  const index = e.target.dataset.index;
  if (gameBoard[index] !== '' || !gameActive) return;

  makeMove(index, currentPlayer);

  if (gameActive) {
    if (currentMode === 'ai' && currentPlayer === 'X') {
      setTimeout(() => {
        const aiIndex = getBestMove();
        makeMove(aiIndex, 'O');
      }, 400);
    }
  }
}



// function handleClick(e) {
//   const index = e.target.dataset.index;
//   if (gameBoard[index] !== '' || !gameActive || currentPlayer !== 'X') return;

//   makeMove(index, 'X');

//   if (gameActive && vsAI) {
//     setTimeout(() => {
//       const aiIndex = getBestMove();
//       makeMove(aiIndex, 'O');
//     }, 500);
//   }
// }

// Make Move
function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('played');
  cells[index].style.color = document.body.classList.contains('dark') ? 'white' : 'black';

  if (checkWin(player)) {
    statusText.textContent = `Player ${player} wins!`;
    gameActive = false;
  } else if (gameBoard.every(cell => cell !== '')) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = player === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Check Winner
function checkWin(player) {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return gameBoard[a] === player &&
           gameBoard[a] === gameBoard[b] &&
           gameBoard[a] === gameBoard[c];
  });
}

// Smart AI (Minimax)
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

// Restart Game
function restartGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('played');
    cell.style.color = document.body.classList.contains('dark') ? 'white' : 'black';
  });
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';

  cells.forEach(cell => {
    cell.style.color = document.body.classList.contains('dark') ? 'white' : 'black';
  });
}
