const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');

const CELL = 80;
const GAP = 6;

let board = Array(9).fill('');
let player = 'X';
let gameOver = false;

const wins = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const strike = document.createElement('div');
strike.className = 'strike';
boardEl.appendChild(strike);

board.forEach((_, i) => {
  const b = document.createElement('button');
  b.className = 'cell';
  b.onclick = () => move(i, b);
  boardEl.appendChild(b);
});

function setTurnTheme() {
  document.body.classList.toggle('turn-x', !gameOver && player === 'X');
  document.body.classList.toggle('turn-o', !gameOver && player === 'O');
}

function getWinCombo() {
  return wins.find(([a, b, c]) => board[a] && board[a] === board[b] && board[b] === board[c]);
}

function indexToCenter(idx) {
  const row = Math.floor(idx / 3);
  const col = idx % 3;
  return {
    x: col * (CELL + GAP) + CELL / 2,
    y: row * (CELL + GAP) + CELL / 2
  };
}

function drawStrike([a, , c]) {
  const p1 = indexToCenter(a);
  const p2 = indexToCenter(c);
  const cx = (p1.x + p2.x) / 2;
  const cy = (p1.y + p2.y) / 2;
  const length = Math.hypot(p2.x - p1.x, p2.y - p1.y) + 26;
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

  strike.style.left = `${cx}px`;
  strike.style.top = `${cy}px`;
  strike.style.setProperty('--strike-len', `${length}px`);
  strike.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  strike.classList.remove('show');
  void strike.offsetWidth;
  strike.classList.add('show');
}

function move(i, btn) {
  if (board[i] || gameOver) return;

  board[i] = player;
  btn.textContent = player;
  btn.classList.add(player.toLowerCase());

  const combo = getWinCombo();
  if (combo) {
    statusEl.textContent = `Player ${player} wins!`;
    combo.forEach((idx) => boardEl.children[idx + 1].classList.add('win'));
    drawStrike(combo);
    gameOver = true;
    setTurnTheme();
    return;
  }

  if (board.every(Boolean)) {
    statusEl.textContent = 'Draw!';
    gameOver = true;
    setTurnTheme();
    return;
  }

  player = player === 'X' ? 'O' : 'X';
  statusEl.textContent = `Player ${player} turn`;
  setTurnTheme();
}

function reset() {
  board = Array(9).fill('');
  player = 'X';
  gameOver = false;

  [...boardEl.children].forEach((node, idx) => {
    if (idx === 0) return;
    node.textContent = '';
    node.className = 'cell';
  });

  strike.className = 'strike';
  strike.style.width = '0';

  statusEl.textContent = 'Player X turn';
  setTurnTheme();
}

resetBtn.onclick = reset;
setTurnTheme();
