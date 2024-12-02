/**
 * Title of Project
 * Mars Lapierre-Furtado
 * 
 * PROJECT DESCRIPTION
 * 
 */

"use strict";

// Game states
let gameState = "start"; // States: "start", "menu", "play", "lose"

// Player (bird)
const bird = {
    x: 100,
    y: 200,
    size: 30,
    velocity: 0,
    gravity: 0.6,
    jumpStrength: -10
};

// Obstacles (pipes)
const pipes = {
    width: 50,
    speed: 3,
    gap: 150, // Space between top and bottom pipes
    list: []
};

// Game variables
let score = 0;

/**
 * Setup function to initialize the game
 */
function setup() {
    createCanvas(400, 600);
    resetGame();
}

/**
 * Main draw loop
 */
function draw() {
    background("#87CEEB"); // Sky blue background

    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "play") {
        moveBird();
        movePipes();
        drawBird();
        drawPipes();
        drawScore();
        checkCollisions();
    } else if (gameState === "lose") {
        drawLoseScreen();
    }
}

/**
 * Move the bird with gravity and update its position
 */
function moveBird() {
    // Apply gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from going off the bottom or top of the screen
    bird.y = constrain(bird.y, 0, height);
}

/**
 * Create and move pipes across the screen
 */
function movePipes() {
    // Add new pipes periodically
    if (frameCount % 100 === 0) {
        createPipe();
    }

    // Move existing pipes
    for (let i = pipes.list.length - 1; i >= 0; i--) {
        pipes.list[i].x -= pipes.speed;

        // Remove pipes that are off the screen
        if (pipes.list[i].x < -pipes.width) {
            pipes.list.splice(i, 1);
        }
    }
}

/**
 * Create a new set of pipes with a random gap position
 */
function createPipe() {
    const gapY = random(100, height - 100 - pipes.gap);
    pipes.list.push({
        x: width,
        topHeight: gapY,
        bottomHeight: height - (gapY + pipes.gap)
    });
}

/**
 * Draw the bird
 */
function drawBird() {
    push();
    fill("#FFD700"); // Gold color
    noStroke();
    ellipse(bird.x, bird.y, bird.size);
    pop();
}

/**
 * Draw the pipes
 */
function drawPipes() {
    push();
    fill("#228B22"); // Green color
    for (let pipe of pipes.list) {
        // Top pipe
        rect(pipe.x, 0, pipes.width, pipe.topHeight);
        // Bottom pipe
        rect(pipe.x, height - pipe.bottomHeight, pipes.width, pipe.bottomHeight);
    }
    pop();
}

/**
 * Check for collisions with pipes or screen edges
 */
function checkCollisions() {
    // Check bottom and top screen boundaries
    if (bird.y >= height || bird.y <= 0) {
        gameState = "lose";
    }

    // Check pipe collisions
    for (let pipe of pipes.list) {
        // Check if bird is within pipe's horizontal range
        if (bird.x + bird.size / 2 > pipe.x && bird.x - bird.size / 2 < pipe.x + pipes.width) {
            // Check top pipe collision
            if (bird.y - bird.size / 2 < pipe.topHeight) {
                gameState = "lose";
            }
            // Check bottom pipe collision
            if (bird.y + bird.size / 2 > height - pipe.bottomHeight) {
                gameState = "lose";
            }
        }

        // Score point when passing pipe
        if (pipe.x + pipes.width < bird.x && !pipe.scored) {
            score++;
            pipe.scored = true;
        }
    }
}

/**
 * Display the score
 */
function drawScore() {
    push();
    fill(255);
    noStroke();
    textSize(32);
    textAlign(RIGHT, TOP);
    text(score, width - 20, 20);
    pop();
}

/**
 * Draw the start screen
 */
function drawStartScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(34);
    fill(255);
    text("Flappy Bird", width / 2, height / 2 - 50);
    textSize(24);
    text("Click to Start", width / 2, height / 2);
    pop();
}

/**
 * Draw the menu screen
 */
function drawMenuScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(34);
    fill(255);
    text("Flappy Bird", width / 2, height / 2 - 50);
    textSize(24);
    text("(0) Flappy Bird", width / 2, height / 2 - 40);
    text("(1) Gravity Bird", width / 2, height / 2);
    text("(2) Time Bird", width / 2, height / 2 + 40);
    pop();
}

/**
 * Draw the lose screen
 */
function drawLoseScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("Game Over!", width / 2, height / 2 - 50);
    textSize(24);
    text("Score: " + score, width / 2, height / 2);
    text("Click to Restart", width / 2, height / 2 + 50);
    pop();
}

/**
 * Handle mouse/key input
 */
function mousePressed() {
    if (gameState === "start") {
        gameState = "menu";
    } else if (gameState === "play") {
        // Make the bird jump
        bird.velocity = bird.jumpStrength;
    } else if (gameState === "lose") {
        resetGame();
    }
}

/**
 * Reset the game to initial state
 */
function resetGame() {
    bird.y = height / 2;
    bird.velocity = 0;
    pipes.list = [];
    score = 0;
    gameState = "start";
}

/**
 * Click Esc to return to menu 
 */
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        gameState = "menu";
    }
});
