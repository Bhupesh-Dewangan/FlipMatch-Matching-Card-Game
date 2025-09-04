const board = document.getElementById("game-board");
const resetBtn = document.getElementById("reset-btn");
const icons = ["🍎", "🍌", "🍓", "🍇", "🍉", "🍒", "🥝", "🍍"];
let cards = [];
let flipped = [];
let matchedCount = 0;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  board.innerHTML = "";
  cards = [...icons, ...icons];
  shuffle(cards);
  matchedCount = 0;
  flipped = [];

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

function flipCard(e) {
  const card = e.currentTarget;
  if (card.classList.contains("flipped") || card.classList.contains("matched") || flipped.length === 2) return;

  card.textContent = card.dataset.icon;
  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    const [first, second] = flipped;
    if (first.dataset.icon === second.dataset.icon) {
      first.classList.add("matched");
      second.classList.add("matched");
      matchedCount += 1;
      if (matchedCount === icons.length) {
  setTimeout(() => {
    alert("🎉 You won!");
    document.getElementById("game-container").style.display = "none";
    document.getElementById("start-screen").style.display = "flex";
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

resetBtn.addEventListener("click", createBoard);

function startGame() {
  createBoard();
}

document.getElementById("start-btn").addEventListener("click", function() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    startGame();
});
