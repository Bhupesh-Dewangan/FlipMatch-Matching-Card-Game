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

const icons = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍒", "🥝", "🍍"];
let cards = [];
let flipped = [];
let matchedCount = 0;
let moves = 0;

let timer;
let seconds = 0;
let isPaused = false;

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
  cards = [...icons, ...icons];
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
      if (matchedCount === icons.length) {
        setTimeout(() => {
          clearInterval(timer);
          alert(
            `🎉 You won!\nTime: ${timerDisplay.textContent.split(" ")[1]} | Moves: ${moves}`,
          );
          gameContainer.style.display = "none";
          startScreen.style.display = "flex";
        }, 300);
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

// Restart
resetBtn.addEventListener("click", createBoard);

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
