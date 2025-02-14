//select HTML elements by id
const game = document.getElementById('game');
const tree = document.getElementById('tree');
const bowl = document.getElementById('bowl');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

//store the current game values
let score = 0;
let treeX = 350;
let bowlX = 350;
let gameOver = false;
const bowlWidth = 100;
const bowlSpeed = 10;
let treeSpeed = 2;
const appleFallSpeed = 3;
const apples = [];
let misses = 0;
const maxMisses = 3;

// get the game area width and position
const gameWidth = game.offsetWidth;
const gameArea = game.getBoundingClientRect();

// move the tree left and right
function moveTree() {
  treeX += treeSpeed;
  if (treeX > gameWidth - 100 || treeX < 0) {
    treeSpeed *= -1; // change direction when the tree hits boundary
  }
  tree.style.left = `${treeX}px`; // update tree position
}

// move the bowl with the mouse
document.addEventListener('mousemove', (e) => {
  if (gameOver) return;

  // mouse x-coordinate relative to the game area
  const mouseX = e.clientX - gameArea.left;

  // make sure that the bowl stays within game area bounds
  if (mouseX > bowlWidth / 2 && mouseX < gameWidth - bowlWidth / 2) {
    bowlX = mouseX - bowlWidth / 2; // center bowl under cursor
    bowl.style.left = `${bowlX}px`; // update bowl position
  } else if (mouseX <= bowlWidth / 2) {
    bowlX = 0; // prevent bowl from moving past left edge
    bowl.style.left = `${bowlX}px`;
  } else if (mouseX >= gameWidth - bowlWidth / 2) {
    bowlX = gameWidth - bowlWidth; // prevent bowl from moving past right edge
    bowl.style.left = `${bowlX}px`;
  }
});

// spawn apples
function spawnApple() {
  if (gameOver) return;
  const apple = document.createElement('div');
  apple.className = 'apple';
  apple.style.left = `${treeX + 50}px`; // Spawn under the tree
  game.appendChild(apple);
  apples.push(apple);
}

// remove apples
function updateApples() {
  for (let i = apples.length - 1; i >= 0; i--) {
    const apple = apples[i];
    const appleY = parseFloat(apple.style.top || 0) + appleFallSpeed;
    apple.style.top = `${appleY}px`;

    // Check if apple is caught
    if (
      appleY > 550 &&
      appleY < 570 &&
      parseFloat(apple.style.left) > bowlX &&
      parseFloat(apple.style.left) < bowlX + bowlWidth
    ) {
      game.removeChild(apple);
      apples.splice(i, 1);
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    }

    // Check if apple is missed
    if (appleY > 600) {
        game.removeChild(apple);
        apples.splice(i, 1);
        gameOver = true;
        gameOverDisplay.style.display = 'block';
    }
  }
}

// keep the game running continuously
function gameLoop() {
  if (gameOver) {
    return;
  }
  moveTree();
  updateApples();
  requestAnimationFrame(gameLoop);
}

// start the game loop
setInterval(spawnApple, 1000); // spawn apple each second
gameLoop();