const board = document.getElementById("game-board");
const resetBtn = document.getElementById("reset-btn");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");

const timerDisplay = document.getElementById("timer");
const movesDisplay = document.getElementById("moves");
const pauseBtn = document.getElementById("pause-btn");

const winModal = document.getElementById("win-modal");
const finalTime = document.getElementById("final-time");
const finalMoves = document.getElementById("final-moves");
const bestScoreText = document.getElementById("best-score");
const playAgainBtn = document.getElementById("play-again-btn");

const diffButtons = document.querySelectorAll(".diff-btn");

const iconPool = [
  "🍎",
  "🍌",
  "🍓",
  "🍇",
  "🍉",
  "🍒",
  "🥝",
  "🍍",
  "🥑",
  "🍑",
  "🍋",
  "🍊",
  "🍐",
  "🍈",
  "🍎",
  "🍌",
  "🍓",
  "🍇",
  "🍉",
  "🍒",
  "🥝",
  "🍍",
  "🥑",
  "🍑",
  "🍋",
  "🍊",
  "🍐",
  "🍈",
  "🍎",
  "🍌",
  "🍓",
  "🍇",
];

let cards = [];
let flipped = [];
let matchedCount = 0;
let moves = 0;

let timer;
let seconds = 0;
let isPaused = false;
let difficulty = "easy";

const difficultyConfig = {
  easy: { grid: 4, pairs: 8 },
  medium: { grid: 6, pairs: 18 },
  hard: { grid: 8, pairs: 32 },
};

// Shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Timer
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!isPaused) {
      seconds++;
      let min = String(Math.floor(seconds / 60)).padStart(2, "0");
      let sec = String(seconds % 60).padStart(2, "0");
      timerDisplay.textContent = `Time: ${min}:${sec}`;
    }
  }, 1000);
}

// Reset stats
function resetStats() {
  moves = 0;
  seconds = 0;
  isPaused = false;
  pauseBtn.textContent = "Pause";
  movesDisplay.textContent = "Moves: 0";
  startTimer();
}

// Create board
function createBoard() {
  board.innerHTML = "";

  const { grid, pairs } = difficultyConfig[difficulty];

  const selectedIcons = iconPool.slice(0, pairs);
  cards = [...selectedIcons, ...selectedIcons];
  shuffle(cards);

  matchedCount = 0;
  flipped = [];

  resetStats();

  cards.forEach((icon, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.dataset.index = index;
    card.textContent = "";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });

  applyResponsiveLayout(grid);
}

function formatTime(sec) {
  const min = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${min}:${s}`;
}

function showWinModal() {
  clearInterval(timer);

  finalTime.textContent = `⏱ Time: ${formatTime(seconds)}`;
  finalMoves.textContent = `🔁 Moves: ${moves}`;

  // Best score logic (lower moves = better)
  const best = localStorage.getItem("flipmatch_best");

  if (!best || moves < Number(best)) {
    localStorage.setItem("flipmatch_best", moves);
    bestScoreText.textContent = "🏆 Best Score: " + moves + " (New!)";
  } else {
    bestScoreText.textContent = "🏆 Best Score: " + best;
  }

  winModal.classList.remove("hidden");
}

// Flip card
function flipCard(e) {
  if (isPaused) return;
  const card = e.currentTarget;
  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    flipped.length === 2
  )
    return;

  card.textContent = card.dataset.icon;
  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;

    const [first, second] = flipped;
    if (first.dataset.icon === second.dataset.icon) {
      first.classList.add("matched");
      second.classList.add("matched");
      matchedCount += 1;
      if (matchedCount === difficultyConfig[difficulty].pairs) {
        setTimeout(showWinModal, 300);
      }
    } else {
      setTimeout(() => {
        first.textContent = "";
        second.textContent = "";
        first.classList.remove("flipped");
        second.classList.remove("flipped");
      }, 800);
    }
    flipped = [];
  }
}

function applyResponsiveLayout(grid) {
  const gap = 8;

  // Measure available width from container
  const containerWidth = gameContainer.clientWidth;

  // Keep board within safe bounds
  const maxBoardWidth = Math.min(containerWidth - 20, 600);

  const cardSize = Math.floor(
    (maxBoardWidth - gap * (grid - 1)) / grid
  );

  board.style.gridTemplateColumns = `repeat(${grid}, ${cardSize}px)`;
  board.style.gap = gap + "px";

  document.querySelectorAll(".card").forEach(card => {
    card.style.width = cardSize + "px";
    card.style.height = cardSize + "px";
    card.style.fontSize = cardSize * 0.35 + "px";
  });
}


// Restart
resetBtn.addEventListener("click", createBoard);

diffButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    diffButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    difficulty = btn.dataset.level;
  });
});

document.querySelector('[data-level="easy"]').classList.add("active");

// Start
startBtn.addEventListener("click", function () {
  startScreen.style.display = "none";
  gameContainer.style.display = "flex";
  createBoard();
});

pauseBtn.addEventListener("click", function () {
  isPaused = !isPaused;

  if (isPaused) {
    pauseBtn.textContent = "Resume";
  } else {
    pauseBtn.textContent = "Pause";
  }
});

window.addEventListener("resize", () => {
  if (gameContainer.style.display === "flex") {
    applyResponsiveLayout(difficultyConfig[difficulty].grid);
  }
});

