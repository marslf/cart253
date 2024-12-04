/**
 * BIRD
 * Mars Lapierre-Furtado
 * 
 * PROJECT DESCRIPTION
 * - Multi-mode Flappy Bird-inspired game exploring unique gameplay mechanics
 * - Six distinct game modes with varied bird and pipe interactions
 * - Progressive difficulty system that challenges player adaptability
 * - Experimental gameplay variations including:
 *   * Classic Flappy Bird mode
 *   * Gravity-reversing bird movement
 *   * Wavy, unpredictable pipe movements
 *   * Progressively narrowing pipe gaps
 *   * Horizontal falling gameplay
 *   * Coin collection mechanics
 *   * Chaotic omnidirectional pipe spawning
 * - Dynamic scoring and difficulty progression
 * - Responsive game states with intuitive menu and intro screens
 * - Uses p5.js for creative, interactive game design
 * 
 * GAME MODES:
 * - Flappy Bird (0): Traditional side-scrolling obstacle avoidance
 * - Gravity Bird (1): Reverse gravity with click interactions
 * - Wavy Bird (2): Pipes move vertically in wave-like patterns
 * - Progress Bird (3): Dynamically increasing difficulty
 * - Falling Bird (4): Horizontal movement, vertically fixed bird
 * - Gold Bird (5): Coin collection for bonus points (3)
 * - Chaos Bird (6): Pipes spawn from multiple directions
 * 
 * CONTROLS:
 * Dependant on the game mode
 * Shown before start
 * - mouse click to bounce/flap upwards 
 * - mouse click to switch gravity (gravity mode)
 * - left and right arrow keys to move horizontally (falling and chaos mode)
 * 
 * Uses:
 * p5.js
 * https://p5js.org
 */

"use strict";

// Game states
let gameState = "menu"; // States: "menu", "flappyBirdIntro", "flappyBird", "gravityBirdIntro", "gravityBird", "wavyBirdIntro", "wavyBird", "progressBirdIntro", "progressBird", "fallingBirdIntro", "fallingBird", "goldBirdIntro", "goldBird", "chaosBirdIntro", chaosBird", "lose"

/**
 * Player (bird)
 */
const bird = {
    x: 100,
    y: 200,
    size: 30,
    velocity: 0,
    gravity: 0.6,
    jumpStrength: -10
};

/**
 * Obstacles (pipes)
 */
const pipes = {
    width: 50,
    speed: 3,
    gap: 180, // Space between top and bottom pipes (default)
    list: []
};

// Game variables
let score = 0;


/**
 * PROGRESS BIRD: Difficulty Progression Configuration
 */
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

// Coins configuration
const coins = {
    size: 15,
    speed: 3,
    list: []
};

const chaosMode = {
    currentDirection: 'right', // Default starting direction
    directionChangeInterval: 300, // Change direction every 300 frames
    possibleDirections: ['right', 'bottom', 'top', 'left']
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
 * draw menu screen
 * draw flappyBird (default mode)
 * draw GravityBird
 * draw wavyBird
 * draw progressBird
 * draw goldBird
 * draw the lose screen
 * 
 */
function draw() {
    background("#87CEEB"); // Sky blue background

    if (gameState === "menu") { //MENU
        drawMenuScreen();
    } else if (gameState === "flappyBirdIntro") {
        drawFlappyBirdIntro();
    } else if (gameState === "flappyBird") { //FLAPPY BIRD (default)
        moveBird();
        movePipes();
        drawBird();
        drawPipes();
        drawScore();
        checkCollisions();
    } else if (gameState === "gravityBirdIntro") {
        drawGravityBirdIntro();
    } else if (gameState === "gravityBird") { //GRAVITY BIRD
        moveBirdWithReversedGravity();
        movePipes();
        drawBirdWithDirectionIndicator();
        drawPipes();
        drawScore();
        checkGravityBirdCollisions();
    } else if (gameState === "wavyBirdIntro") {
        drawWavyBirdIntro();
    } else if (gameState === "wavyBird") { //WAVY BIRD
        moveBird();
        moveWavyPipes(); //Wavy pipe function
        drawBird();
        drawPipes();
        drawScore();
        checkCollisions();
    } else if (gameState === "progressBirdIntro") {
        drawProgressBirdIntro();
    } else if (gameState === "progressBird") { //PROGRESS BIRD
        moveBird();
        movePipes();
        drawBird();
        drawPipes();
        drawScore();
        drawDifficultyIndicator(); // New difficulty visualization
        checkCollisions();
    } else if (gameState === "fallingBirdIntro") {
        drawFallingBirdIntro();
    } else if (gameState === "fallingBird") { //FALLING BIRD
        moveFallingBird(); // Falling Bird movement
        moveFallingPipes(); // Falling Pipe movement
        drawBird();
        drawFallingPipes(); // Draw the falling pipes
        drawScore();
        checkFallingBirdCollisions(); // Check for falling bird collisions
    } else if (gameState === "goldBirdIntro") {
        drawGoldBirdIntro();
    } else if (gameState === "goldBird") { //GOLD BIRD
        moveBird();
        movePipesAndCoins();
        drawBird();
        drawPipes();
        drawCoins();
        drawScore();
        checkCollisionsWithCoins();
    } else if (gameState === "chaosBirdIntro") {
        drawChaosBirdIntro();
    } else if (gameState === "chaosBird") { //CHAOS BIRD
        moveBird();
        moveChaosPipes();
        drawBird();
        drawChaosPipes();
        drawScore();
        checkChaosModeCollisions();
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
    //Horizontal movement for CHAOS bird mode 
    if (gameState === "chaosBird") {
        if (keyIsDown(LEFT_ARROW)) {
            bird.x -= 3;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            bird.x += 3;
        }
        // Keep bird on screen
        bird.x = constrain(bird.x, 0, width);
    }
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

/**
 * Move the bird and update its position
 */
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

/**
 * Draw specific gravity bird w/ direction indicator
 */
function drawBirdWithDirectionIndicator() {
    push();
    // Change color based on gravity direction
    if (bird.gravityDirection === 1) {
        fill("#FFD700"); // Gold when gravity is down
    } else {
        fill("#FF8C001"); // Orange when gravity is up
    }

    ellipse(bird.x, bird.y, bird.size);

    // Wing (small circle on lower left)
    fill("#FFA500"); // Orange wing color
    ellipse(bird.x - bird.size / 3, bird.y + bird.size / 3, bird.size / 3);

    pop();
}

/**
 * Create modified gravity collision checker
 */
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
 * WAVY BIRD funcitons
 */

/**
 * Moving Pipes function
 */
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
 * PROGRESS BIRD functions
 */

/**
 * Visual indicator of current difficulty stage
 */
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
 * FALLING BIRD functions
 */

/**
 * Falling bird movement
 */
function moveFallingBird() {
    // Smooth horizontal movement
    if (keyIsDown(LEFT_ARROW)) {
        bird.x -= 3;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        bird.x += 3;
    }

    // Keep bird fixed vertically
    bird.y = height / 3;
    // Only allow horizontal movement but keep bird on screen 
    bird.x = constrain(bird.x, 0, width);
}

/**
 * Modified pipe movement for falling pipes
 */
function moveFallingPipes() {
    // Add new pipes periodically
    if (frameCount % 100 === 0) {
        createFallingPipe();
    }

    // Move existing pipes upward (from bottom to top)
    for (let i = pipes.list.length - 1; i >= 0; i--) {
        pipes.list[i].y -= pipes.speed;

        // Remove pipes that are off the top of the screen
        if (pipes.list[i].y + pipes.height < 0) {
            pipes.list.splice(i, 1);
        }
    }
}

/**
 * Create horizontal pipes
 */
function createFallingPipe() {
    const pipeX = random(50, width - pipes.gap - 50); // Random x position within screen bounds
    pipes.list.push({
        x: pipeX,
        y: height, // Start from the bottom of the screen
        width: pipes.gap, // Use gap size as pipe width
        height: pipes.width, // Use standard pipe width as height
        scored: false
    });
}

/**
 *Collision detection for Falling Bird
  */
function checkFallingBirdCollisions() {
    // Check side boundaries
    if (bird.x <= 0 || bird.x + bird.size >= width) {
        gameState = "lose";
    }

    // Check pipe collisions
    for (let pipe of pipes.list) {
        if (
            bird.x + bird.size / 2 > pipe.x && // Check if bird is within pipe's horizontal range
            bird.x - bird.size / 2 < pipe.x + pipe.width &&
            bird.y + bird.size / 2 > pipe.y && // Check if bird is within pipe's vertical range
            bird.y - bird.size / 2 < pipe.y + pipe.height
        ) {
            gameState = "lose";
        }

        // Score point when bird passes the pipe
        if (pipe.x + pipe.width < bird.x && !pipe.scored) {
            score++;
            pipe.scored = true;
        }
    }
}

/**
 * Draw horizontal pipes
 */
function drawFallingPipes() {
    push();
    fill("#228B22"); // Green color
    for (let pipe of pipes.list) {
        rect(pipe.x, pipe.y, pipe.width, pipe.height);
    }
    pop();
}


/**
 * GOLD BIRD functions
 */

/**
 * Create pipe + sometimes create coins 
 */
function createPipeAndCoin() {
    // Create pipe as normal
    const currentStage = difficultyProgression.getCurrentStage(score);
    const gapSize = currentStage.gapSize;
    const gapY = random(100, height - 100 - pipes.gap);
    const newPipe = {
        x: width,
        topHeight: gapY,
        bottomHeight: height - (gapY + pipes.gap),
        currentStage: currentStage
    };
    pipes.list.push(newPipe);

    // 30% chance to create a coin
    if (random() < 0.3) {
        // Try to find a safe coin position
        let coinY;
        let isSafe;
        let attempts = 0;

        do {
            // Reset safety flag
            isSafe = true;

            // Generate a random Y position
            coinY = random(50, height - 50);

            // Check against the newly created pipe
            if (
                coinY < newPipe.topHeight ||  // Coin in top pipe area
                coinY > height - newPipe.bottomHeight  // Coin in bottom pipe area
            ) {
                isSafe = false;
            }

            // Increment attempts to prevent infinite loop
            attempts++;

            // If we can't find a safe spot after 10 tries, skip coin creation
            if (attempts > 10) {
                return;
            }
        } while (!isSafe);

        // If we found a safe position, create the coin
        coins.list.push({
            x: width,
            y: coinY
        });
    }
}

/**
 * Move pipes and coins
 */
function movePipesAndCoins() {
    // Add new pipes periodically
    if (frameCount % 100 === 0) {
        createPipeAndCoin();
    }

    // Move existing pipes
    for (let i = pipes.list.length - 1; i >= 0; i--) {
        pipes.list[i].x -= pipes.speed;

        // Remove pipes that are off the screen
        if (pipes.list[i].x < -pipes.width) {
            pipes.list.splice(i, 1);
        }
    }

    // Move existing coins
    for (let i = coins.list.length - 1; i >= 0; i--) {
        coins.list[i].x -= coins.speed;

        // Remove coins that are off the screen
        if (coins.list[i].x < -coins.size) {
            coins.list.splice(i, 1);
        }
    }
}

/**
 * Draw coins
 */
function drawCoins() {
    push();
    fill("#FFD700"); // Gold color for coins
    for (let coin of coins.list) {
        ellipse(coin.x, coin.y, coins.size);
    }
    pop();
}

/**
 * Colision checker with coins and coin score impact
 */
function checkCollisionsWithCoins() {
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
    // Check coin collection
    for (let i = coins.list.length - 1; i >= 0; i--) {
        const coin = coins.list[i];
        // Check if bird touches the coin
        if (
            bird.x + bird.size / 2 > coin.x - coins.size / 2 &&
            bird.x - bird.size / 2 < coin.x + coins.size / 2 &&
            bird.y + bird.size / 2 > coin.y - coins.size / 2 &&
            bird.y - bird.size / 2 < coin.y + coins.size / 2
        ) {
            // Collect coin and add points
            coins.list.splice(i, 1);
            score += 3;
        }
    }
}



/**
 * CHAOS BIRD functions
 */

/**
 * Modified pipe creation function for chaos mode
 */
function createChaosPipe() {
    // Randomly change direction periodically
    if (frameCount % chaosMode.directionChangeInterval === 0) {
        chaosMode.currentDirection = random(chaosMode.possibleDirections);
    }

    const currentStage = difficultyProgression.getCurrentStage(score);
    const gapSize = currentStage.gapSize;

    switch (chaosMode.currentDirection) {
        case 'right':
            const gapY = random(100, height - 100 - pipes.gap);
            pipes.list.push({
                x: width,
                y: 0,
                topHeight: gapY,
                bottomHeight: height - (gapY + pipes.gap),
                direction: 'right',
                width: pipes.width
            });
            break;

        case 'bottom':
            const gapX = random(100, width - 100 - pipes.gap);
            pipes.list.push({
                x: gapX,
                y: height,
                topWidth: pipes.gap,
                bottomWidth: width - (gapX + pipes.gap),
                direction: 'bottom',
                height: pipes.width
            });
            break;

        case 'top':
            const topGapX = random(100, width - 100 - pipes.gap);
            pipes.list.push({
                x: topGapX,
                y: 0,
                topWidth: pipes.gap,
                bottomWidth: width - (topGapX + pipes.gap),
                direction: 'top',
                height: pipes.width
            });
            break;

        case 'left':
            const leftGapY = random(100, height - 100 - pipes.gap);
            pipes.list.push({
                x: 0,
                y: 0,
                topHeight: leftGapY,
                bottomHeight: height - (leftGapY + pipes.gap),
                direction: 'left',
                width: pipes.width
            });
            break;
    }
}

/**
 * Modified pipe movement for chaos mode
  */
function moveChaosPipes() {
    // Add new pipes periodically
    if (frameCount % 100 === 0) {
        createChaosPipe();
    }
    // Move existing pipes based on their direction
    for (let i = pipes.list.length - 1; i >= 0; i--) {
        switch (pipes.list[i].direction) {
            case 'right':
                pipes.list[i].x -= pipes.speed;
                break;
            case 'bottom':
                pipes.list[i].y -= pipes.speed;
                break;
            case 'top':
                pipes.list[i].y += pipes.speed;
                break;
            case 'left':
                pipes.list[i].x += pipes.speed;
                break;
        }

        // Remove pipes that are off the screen
        if (
            pipes.list[i].x < -pipes.width ||
            pipes.list[i].x > width ||
            pipes.list[i].y < -pipes.width ||
            pipes.list[i].y > height
        ) {
            pipes.list.splice(i, 1);
        }
    }
}

/**
 * Modified drawing function for chaos mode pipes
 */
function drawChaosPipes() {
    push();
    fill("#228B22"); // Green color

    for (let pipe of pipes.list) {
        switch (pipe.direction) {
            case 'right':
                // Top pipe
                rect(pipe.x, 0, pipes.width, pipe.topHeight);
                // Bottom pipe
                rect(pipe.x, height - pipe.bottomHeight, pipes.width, pipe.bottomHeight);
                break;

            case 'bottom':
                // Left pipe
                rect(0, pipe.y, pipe.topWidth, pipes.width);
                // Right pipe
                rect(width - pipe.bottomWidth, pipe.y, pipe.bottomWidth, pipes.width);
                break;

            case 'top':
                // Left pipe
                rect(0, pipe.y, pipe.topWidth, pipes.width);
                // Right pipe
                rect(width - pipe.bottomWidth, pipe.y, pipe.bottomWidth, pipes.width);
                break;

            case 'left':
                // Top pipe
                rect(pipe.x, 0, pipes.width, pipe.topHeight);
                // Bottom pipe
                rect(pipe.x, height - pipe.bottomHeight, pipes.width, pipe.bottomHeight);
                break;
        }
    }
    pop();
}

/**
 * Modified collision detection for chaos mode
 */
function checkChaosModeCollisions() {
    // Check bottom and top screen boundaries
    if (bird.y >= height || bird.y <= 0) {
        gameState = "lose";
    }

    // Check pipe collisions (more complex due to multiple directions)
    for (let pipe of pipes.list) {
        switch (pipe.direction) {
            case 'right':
                if (bird.x + bird.size / 2 > pipe.x && bird.x - bird.size / 2 < pipe.x + pipes.width) {
                    if (bird.y - bird.size / 2 < pipe.topHeight || bird.y + bird.size / 2 > height - pipe.bottomHeight) {
                        gameState = "lose";
                    }
                }
                break;

            case 'bottom':
                if (bird.y + bird.size / 2 > pipe.y && bird.y - bird.size / 2 < pipe.y + pipes.width) {
                    if (bird.x - bird.size / 2 < pipe.topWidth || bird.x + bird.size / 2 > width - pipe.bottomWidth) {
                        gameState = "lose";
                    }
                }
                break;

            case 'top':
                if (bird.y - bird.size / 2 < pipe.y + pipes.width && bird.y + bird.size / 2 > pipe.y) {
                    if (bird.x - bird.size / 2 < pipe.topWidth || bird.x + bird.size / 2 > width - pipe.bottomWidth) {
                        gameState = "lose";
                    }
                }
                break;

            case 'left':
                if (bird.x - bird.size / 2 < pipe.x + pipes.width && bird.x + bird.size / 2 > pipe.x) {
                    if (bird.y - bird.size / 2 < pipe.topHeight || bird.y + bird.size / 2 > height - pipe.bottomHeight) {
                        gameState = "lose";
                    }
                }
                break;
        }

        // Scoring logic
        if (
            (pipe.direction === 'right' && pipe.x + pipes.width < bird.x && !pipe.scored) ||
            (pipe.direction === 'bottom' && pipe.y < 0 && !pipe.scored) ||
            (pipe.direction === 'top' && pipe.y > height && !pipe.scored) ||
            (pipe.direction === 'left' && pipe.x > width && !pipe.scored)
        ) {
            score++;
            pipe.scored = true;
        }
    }
}



/**
 * OTHER GENERAL FUNCTIONS
 */

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
 * Draw the menu screen
 */
function drawMenuScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(38);
    fill(255);
    text("BIRD", width / 2, height / 2 - 150);
    textSize(24);
    text("(0) Flappy Bird", width / 2, height / 2 - 40);
    text("(1) Gravity Bird", width / 2, height / 2);
    text("(2) Wavy Bird", width / 2, height / 2 + 40);
    text("(3) Progress Bird", width / 2, height / 2 + 80);
    text("(4) Falling Bird", width / 2, height / 2 + 120);
    text("(5) Gold Bird", width / 2, height / 2 + 160);
    text("(6) Chaos Bird", width / 2, height / 2 + 200);
    text("Click to FLY!", width / 2, height / 2 - 200);
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
    text("Click to return to menu", width / 2, height / 2 + 50);
    pop();
}


/**
 * Handle mouse/key input depending on the game state
 */
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
    } else if (gameState === "fallingBirdIntro") {
        gameState = "fallingBird";
        return;
    } else if (gameState === "goldBirdIntro") {
        gameState = "goldBird";
        return;
    } else if (gameState === "chaosBirdIntro") {
        gameState = "chaosBird";
        return;
    }

    // Game play actions
    if (gameState === "flappyBird" || gameState === "wavyBird" || gameState === "progressBird" || gameState === "goldBird" || gameState === "chaosBird") {
        bird.velocity = bird.jumpStrength;
    } else if (gameState === "gravityBird") {
        bird.gravityDirection *= -1;
        bird.velocity = bird.jumpStrength * bird.gravityDirection;
    } else if (gameState === "lose") {
        resetGame();
    }
}



/**
 * Handle different game mode state changes in menu
 */
function keyPressed() {
    if (gameState === "menu") {
        if (key === '0') {
            gameState = "flappyBirdIntro";
        } else if (key === '1') {
            gameState = "gravityBirdIntro";
        } else if (key === '2') {
            gameState = "wavyBirdIntro";
        } else if (key === '3') {
            gameState = "progressBirdIntro";
        } else if (key === '4') {
            gameState = "fallingBirdIntro";
        } else if (key === '5') {
            gameState = "goldBirdIntro";
        } else if (key === '6') {
            gameState = "chaosBirdIntro";
        }
    }
}



/**
 * RESET the game to default state
 */
function resetGame() {
    bird.y = height / 2;
    bird.velocity = 0;
    bird.gravityDirection = 1; // Reset gravity direction to downward
    pipes.list = [];
    coins.list = []; // Reset coins list
    score = 0;
    bird.x = width / 2; //center bird horizontally 
    gameState = "menu";
}


/**
 * INTRO SCREENS
 */


/**
 * Draw FLAPPY bird intro
*/
function drawFlappyBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("FLAPPY BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Always stay flapping!", width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("Click anywhere to start", width / 2, height / 2 + 80);
    pop();
}

/**
 * Draw GRAVITY bird intro
*/
function drawGravityBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("GRAVITY BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("No flapping, just gravitating!", width / 2, height / 2);
    text("[CLICK] to switch gravity", width / 2, height / 2 + 50);
    text("(Click anywhere to start)", width / 2, height / 2 + 80);
    pop();
}

/**
 * Draw WAVY bird intro
 */
function drawWavyBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("WAVY BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Keep flying, watch for the pipes!", width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("(Click anywhere to start)", width / 2, height / 2 + 80);
    pop();
}

/**
 * Draw PROGRESS bird intro
 */
function drawProgressBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("PROGRESS BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Oh no! It's gonna get difficulty!", width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("Click anywhere to start", width / 2, height / 2 + 80);
    pop();
}

/**
 * Draw FALLING bird intro
 */
function drawFallingBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("FALLING BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Oh no you're falling! Better dodge the pipes!", width / 2, height / 2);
    text("[LEFT/RIGHT] Arrows to move", width / 2, height / 2 + 50);
    text("Click anywhere to start", width / 2, height / 2 + 80);
    pop();
}

/**
 * Draw GOLD bird intro
*/
function drawGoldBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("COIN BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Collect golden coins for extra points!", width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("Click anywhere to start", width / 2, height / 2 + 80);
    pop();
}

/**
 * Draw CHAOS bird intro
*/
function drawChaosBirdIntro() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("CHAOS BIRD", width / 2, height / 2 - 50);
    textSize(22);
    text("Pipes come from everywhere!", width / 2, height / 2);
    text("[CLICK] to flap your wings", width / 2, height / 2 + 50);
    text("[LEFT/RIGHT] Arrows to move", width / 2, height / 2 + 80);
    text("Click anywhere to start", width / 2, height / 2 + 120);
    pop();
}