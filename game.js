const gameCanvas = document.querySelector('.game-canvas');
const player = document.querySelector('.player');
const scoreDisplay = document.getElementById('score');
const speedDisplay = document.getElementById('speed');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const maxSpeedDisplay = document.getElementById('maxSpeed');

let playerX = 185;
let score = 0;
let speed = 0;
let maxSpeed = 0;
let gameRunning = true;
let obstacles = [];
let obstacleSpeed = 3;
let spawnRate = 0.02;

const playerWidth = 30;
const playerHeight = 40;
const canvasWidth = 400;
const canvasHeight = 600;

// Keyboard controls
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

class Obstacle {
    constructor() {
        this.width = 30;
        this.height = 40;
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height;
        this.element = document.createElement('div');
        this.element.className = 'obstacle';
        gameCanvas.appendChild(this.element);
        this.update();
    }

    update() {
        this.y += obstacleSpeed;
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
    }

    draw() {
        this.update();
    }

    isOffScreen() {
        return this.y > canvasHeight;
    }

    collidesWith(px, py, pw, ph) {
        return !(this.x + this.width < px ||
                 px + pw < this.x ||
                 this.y + this.height < py ||
                 py + ph < this.y);
    }

    remove() {
        this.element.remove();
    }
}

function updatePlayer() {
    if (keys['ArrowLeft'] && playerX > 0) {
        playerX -= 6;
    }
    if (keys['ArrowRight'] && playerX < canvasWidth - playerWidth) {
        playerX += 6;
    }

    player.style.left = playerX + 'px';
}

function spawnObstacle() {
    if (Math.random() < spawnRate) {
        obstacles.push(new Obstacle());
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].draw();

        // Check collision
        if (obstacles[i].collidesWith(playerX, canvasHeight - 70, playerWidth, playerHeight)) {
            endGame();
        }

        // Remove if off screen
        if (obstacles[i].isOffScreen()) {
            obstacles[i].remove();
            obstacles.splice(i, 1);
            score += 10;
            speed = Math.min(speed + 0.1, 12);
            obstacleSpeed = 3 + (speed * 0.3);
            spawnRate = Math.min(0.02 + (score / 1000), 0.08);
            scoreDisplay.textContent = score;
            speedDisplay.textContent = Math.floor(speed);
            maxSpeed = Math.max(maxSpeed, speed);
        }
    }
}

function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = 'block';
    finalScoreDisplay.textContent = score;
    maxSpeedDisplay.textContent = Math.floor(maxSpeed);
}

function gameLoop() {
    if (!gameRunning) return;

    updatePlayer();
    spawnObstacle();
    updateObstacles();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();