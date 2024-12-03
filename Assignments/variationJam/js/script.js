/**
 * BIRD
 * Mars Lapierre-Furtado
 * 
 * PROJECT DESCRIPTION
 * 
 */

"use strict";

// Game states
let gameState = "menu"; // States: "menu", "flappyBirdIntro", "flappyBird", "gravityBirdIntro", "gravityBird", "wavyBirdIntro", "wavyBird", "progressBirdIntro", "progressBird" "lose"

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
    gap: 180, // Space between top and bottom pipes (default)
    list: []
};

// Game variables
let score = 0;


// PROGRESS BIRD: Difficulty Progression Configuration
const difficultyProgression = {
    // Array of difficulty stages
    stages: [
        { minScore: 0, maxScore: 10, gapSize: 180 },  // Initial easy stage
        { minScore: 10, maxScore: 20, gapSize: 160 },  // Slightly smaller gap
        { minScore: 20, maxScore: 30, gapSize: 140 },  // Narrower gap
        { minScore: 30, maxScore: 40, gapSize: 120 },  // Very narrow gap
        { minScore: 40, maxScore: 50, gapSize: 100 },  // Extremely challenging
        { minScore: 50, maxScore: Infinity, gapSize: 80 }  // Maximum difficulty
    ],

    // Getcurrent difficulty stage = loop to find the appropriate difficulty stage
    getCurrentStage(currentScore) {
        for (let stage of this.stages) {
            if (currentScore >= stage.minScore && currentScore < stage.maxScore) {
                return stage;
            }
        }
        // Default to the last stage if no matching stage found
        return this.stages[this.stages.length - 1];
    }
};



/**
 * SETUP function to initialize the game
 */
function setup() {
    createCanvas(400, 600);
    resetGame();
}

/**
 * Main draw loop
 * 
 * draw the menu screen
 * draw the flappyBird (default mode)
 * draw the GravityBird
 * draw WavyBird
 * draw the lose screen
 * 
 */
function draw() {
    background("#87CEEB"); // Sky blue background

    if (gameState === "menu") {
        drawMenuScreen();
    } else if (gameState === "flappyBirdIntro") {
        drawFlappyBirdIntro();
    } else if (gameState === "flappyBird") {
        moveBird();
        movePipes();
        drawBird();
        drawPipes();
        drawScore();
        checkCollisions();
    } else if (gameState === "gravityBirdIntro") {
        drawGravityBirdIntro();
    } else if (gameState === "gravityBird") { //similar to regular game mode but with gravity=specific mechanics
        moveBirdWithReversedGravity();
        movePipes();
        drawBirdWithDirectionIndicator();
        drawPipes();
        drawScore();
        checkGravityBirdCollisions();
    } else if (gameState === "wavyBirdIntro") {
        drawWavyBirdIntro();
    } else if (gameState === "wavyBird") {
        moveBird();
        moveWavyPipes(); //Wavy pipe function
        drawBird();
        drawPipes();
        drawScore();
        checkCollisions();
    } else if (gameState === "progressBirdIntro") {
        drawProgressBirdIntro();
    } else if (gameState === "progressBird") {
        moveBird();
        movePipes();
        drawBird();
        drawPipes();
        drawScore();
        drawDifficultyIndicator(); // New difficulty visualization
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
 * Create a new set of pipes with gap size according to difficulty stage and random gap position 
 */
function createPipe() {
    const currentStage = difficultyProgression.getCurrentStage(score); //current difficulty stage based on score 
    const gapSize = currentStage.gapSize; //use gap size based on stage 
    const gapY = random(100, height - 100 - pipes.gap); //randomize gap position but keep correct gap size 
    pipes.list.push({
        x: width,
        topHeight: gapY,
        bottomHeight: height - (gapY + pipes.gap),
        currentStage: currentStage //attach stage info to pipe
    });
}

/**
 * Draw the bird
 * 
 *with dark outline
 *with small wing
 */
function drawBird() {
    push();
    // Main bird body
    fill("#FFD700"); // Original gold color
    ellipse(bird.x, bird.y, bird.size);

    // Wing (small circle on lower left)
    fill("#FFA500"); // Orange wing color
    ellipse(bird.x - bird.size / 3, bird.y + bird.size / 3, bird.size / 3);

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
 * GRAVITY BIRD SPECIFIC FUNCTIONS
 */

//Move the bird and update its position
function moveBirdWithReversedGravity() {
    //Gravity direction property to the bird
    if (!bird.gravityDirection) {
        bird.gravityDirection = 1; // Default downward
    }

    // Apply gravity in the current direction
    bird.velocity += bird.gravity * bird.gravityDirection;
    bird.y += bird.velocity;

    // Prevent bird from going off the bottom or top of the screen
    bird.y = constrain(bird.y, 0, height);
}

//Draw specific gravity bird w/ direction indicator
function drawBirdWithDirectionIndicator() {
    push();
    // Change color based on gravity direction
    if (bird.gravityDirection === 1) {
        fill("#FFD700"); // Gold when gravity is down
    } else {
        fill("#4169E1"); // Royal Blue when gravity is up
    }

    ellipse(bird.x, bird.y, bird.size);

    // Wing (small circle on lower left)
    fill("#FFA500"); // Orange wing color
    ellipse(bird.x - bird.size / 3, bird.y + bird.size / 3, bird.size / 3);

    pop();
}

//Create modified gravity collision checker
function checkGravityBirdCollisions() {
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
 * WAVY BIRD SPECIFIC FUNCTIONS
 */

//Moving Pipes function
function moveWavyPipes() {
    // Add new pipes periodically
    if (frameCount % 100 === 0) {
        createPipe();
    }

    // Move existing pipes
    for (let i = pipes.list.length - 1; i >= 0; i--) {
        pipes.list[i].x -= pipes.speed; // Horizontal movement

        // Vertical movement (modification) 
        if (!pipes.list[i].verticalSpeed) {
            pipes.list[i].verticalSpeed = random(-1, 1); // Initialize random vertical speed when pipe is created
        }

        // Move both top and bottom pipes together while maintaining gap
        pipes.list[i].topHeight += pipes.list[i].verticalSpeed;
        pipes.list[i].bottomHeight = height - (pipes.list[i].topHeight + pipes.gap);

        if (pipes.list[i].topHeight < 50 || pipes.list[i].topHeight > height - 230) { // Ensure there's always enough space to pass through
            pipes.list[i].verticalSpeed *= -1;
        }

        // Remove pipes that are off the screen
        if (pipes.list[i].x < -pipes.width) {
            pipes.list.splice(i, 1);
        }
    }
}


/**
 * PROGRESS BIRD
 */

//Visual indicator of current difficulty stage
function drawDifficultyIndicator() {
    push();
    const currentStage = difficultyProgression.getCurrentStage(score);

    // Color intensity increases with difficulty
    const difficultyColor = lerpColor(
        color(0, 255, 0),  // Green (easy)
        color(255, 0, 0),  // Red (hard)
        map(currentStage.gapSize, 180, 80, 0, 1)
    );

    fill(difficultyColor);
    noStroke();
    textSize(16);
    textAlign(LEFT, TOP);
    text(`Difficulty: ${currentStage.gapSize}px gap`, 10, 10);
    pop();
}



/**
 * OTHER GENERAL FUNCTIONS FUNCTIONS
 */

//Display the score
function drawScore() {
    push();
    fill(255);
    noStroke();
    textSize(32);
    textAlign(RIGHT, TOP);
    text(score, width - 20, 20);
    pop();
}



//Draw the menu screen
function drawMenuScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(34);
    fill(255);
    text("BIRD", width / 2, height / 2 - 150);
    textSize(24);
    text("(0) Flappy Bird", width / 2, height / 2 - 40);
    text("(1) Gravity Bird", width / 2, height / 2);
    text("(2) Wavy Bird", width / 2, height / 2 + 40);
    text("(3) Progress Bird", width / 2, height / 2 + 80);
    text("Click to FLY!", width / 2, height / 1.2);
    pop();
}


//Draw the lose screen
function drawLoseScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("Game Over!", width / 2, height / 2 - 50);
    textSize(24);
    text("Score: " + score, width / 2, height / 2);
    text("Click to return to menu", width / 2, height / 2 + 50);
    pop();
}


//Handle mouse/key input depending on the game state
function mousePressed() {
    if (gameState === "menu") {
        return; // Do nothing in menu
    }

    if (gameState === "flappyBirdIntro") {
        gameState = "flappyBird";
        return;
    } else if (gameState === "gravityBirdIntro") {
        gameState = "gravityBird";
        return;
    } else if (gameState === "wavyBirdIntro") {
        gameState = "wavyBird";
        return;
    } else if (gameState === "progressBirdIntro") {
        gameState = "progressBird";
        return;
    }

    // Game play actions
    if (gameState === "flappyBird" || gameState === "wavyBird" || gameState === "progressBird") {
        bird.velocity = bird.jumpStrength;
    } else if (gameState === "gravityBird") {
        bird.gravityDirection *= -1;
        bird.velocity = bird.jumpStrength * bird.gravityDirection;
    } else if (gameState === "lose") {
        resetGame();
    }
}



//Handle different game mode state changes
function keyPressed() {
    if (gameState === "menu") {
        if (key === '0') {
            gameState = "flappyBirdIntro";
        } else if (key === '1') {
            gameState = "gravityBirdIntro";
        } else if (key === '2') {
            gameState = "wavyBirdIntro";
        } else if (key === '3') {
            gameState = "progressBirdIntro"
        }
    }
}



//Reset the game to initial state
function resetGame() {
    bird.y = height / 2;
    bird.velocity = 0;
    bird.gravityDirection = 1; // Reset gravity direction to downward
    pipes.list = [];
    score = 0;
    gameState = "menu";
}

/**
 * INTRO SCREENS
 */

//Draw FLAPPY bird intro
function drawFlappyBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("FLAPPY BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Always stay flapping!" + score, width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("Click anywhere to start", width / 2, height / 2 + 80);
    pop();
}

//Draw GRAVITY bird intro
function drawGravityBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("GRAVITY BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("No flapping, just gravitating!" + score, width / 2, height / 2);
    text("[CLICK] to switch gravity", width / 2, height / 2 + 50);
    text("(Click anywhere to start)", width / 2, height / 2 + 80);
    pop();
}

//Draw WAVY bird intro
function drawWavyBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("WAVY BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Keep flying, watch for the pipes!" + score, width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("(Click anywhere to start)", width / 2, height / 2 + 80);
    pop();
}

//Draw PROGRESS bird intro
function drawProgressBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("PROGRESS BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Oh no! It's gonna get difficulty!" + score, width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("Click anywhere to start", width / 2, height / 2 + 80);
    pop();
}