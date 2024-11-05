/**
 * Froggy Feast
 * Mars Lapierre-Furtado
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * - If you miss 3 dlies, game over!
 * 
 * Made with p5
 * https://p5js.org/
 * 
 * New feature design:
 * Add one to the score every time you catch a fly. Make the score visible as a number.
 * 
 * New feature:
 * - When the tongue catches/touches a fly, add one to the score
 * - And diplay the score in the draw
 * - "Start" screen
 * - "Win" state if 5 flies are caught
 * - "lose" state if 3 flies are missed
 * 
 * 
 */

"use strict";

//Game states (default = start)
let gameState = "start" //States: "start" , "play1" , "win" "lose"

//Variable to count the missed flies
let missedFlies = 0;

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

//The starting score
let score = 0;
const maxScore = 5; //Score to win the game 

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
}

function draw() {
    background("#87ceeb");

    //Draw the Start Screen
    if (gameState === "start") {
        drawStartScreen();

        //Draw Game Screen 1
    } else if (gameState === "play1") {
        moveFly();
        drawFly();
        moveFrog();
        moveTongue();
        drawFrog();
        checkTongueFlyOverlap();
        drawScore();
        drawMissedCount();

        //Check for win condition
        if (score >= maxScore) {
            gameState = "win";
        }

        //Check for lose condition
        if (missedFlies >= 3) {
            gameState = "lose"
        }
        // Draw the Win Screen
    } else if (gameState === "win") {
        drawWinScreen();

        // Draw the Lose Screen
    } else if (gameState === "lose") {
        drawLoseScreen();
    }

}


/**
 * Draws the start screen with a start button
 */
function drawStartScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(34);
    fill(255);
    text("Froggy Feast", width / 2, height / 2 - 50);
    textSize(24);
    text("Click to Start", width / 2, height / 2);
    pop();
}

/**
 * Draws the Win screen with the score and restart button
 */
function drawWinScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("You Win!", width / 2, height / 2 - 50);
    textSize(24);
    text("Score: " + score, width / 2, height / 2);
    text("Click to Restart", width / 2, height / 2 + 50);
    pop();
}

function drawLoseScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("Game Over!", width / 2, height / 2 - 50);
    textSize(24);
    text("Score: " + score, width / 2, height / 2);
    text("Missed Flies: " + missedFlies + "/3", width / 2, height / 2 + 30);
    text("Click to Restart", width / 2, height / 2 + 80);
    pop();
}

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        missedFlies++; // Add to the missed flies counter
        resetFly();

        // Check if missed flies reach the limit
        if (missedFlies >= 3) {
            gameState = "lose"; // Change game state to end
        }
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    pop();
}

/**
 * Resets the fly to the left with a random y
 */
function resetFly() {
    fly.x = 0;
    fly.y = random(0, 300);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Display the score in white in the top right corner
 */
function drawScore() {
    push();
    fill(255);
    noStroke();
    textSize(64);
    textAlign(RIGHT, TOP);
    text(score, width - 50, 50);
    pop();
}

/**
 * Display number of missed flies in red in the top left corner
 */
function drawMissedCount() {
    push();
    fill(255, 0, 0);
    noStroke();
    textSize(60);
    textAlign(LEFT, TOP);
    text(missedFlies + "/3", width - 50, 50);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        //Increase the score
        score = score + 1;
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}


/**
 * What mousePressed does depending on the game state
 * Launch the tongue on click (if it's not launched yet)
 * or start/restart the game
 */
function mousePressed() {
    if (gameState === "start") {
        gameState = "play1"; //When in game state start switch to state play 1)
        score = 0; // Reset score when game starts
        missedFlies = 0; // Reset missed flies
        resetFly(); // Reset fly position

    } else if (gameState === "play1") { //When in game state play1 Launch the tongue on click (if it's not launched yet)
        if (frog.tongue.state === "idle") {
            frog.tongue.state = "outbound";
        }

    } else if (gameState === "lose") { //When in state lose switch to state start
        gameState = "start"; // Go back to start screen

    } else if (gameState === "win") { //When in state win switch to state start
        gameState = "start"; // Go back to start screen
    }
}
