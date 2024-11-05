/**
 * Frogfrogfrog
 * Pippin Barr
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 * 
 * New feature design:
 * Add one to the score every time you catch a fly. Make the score visible as a number.
 * 
 * New feature:
 * - When the tongue catches/touches a fly, add one to the score
 * - And dsiplay the score in the draw
 * - "Start" and "end" states (with buttons to start and restart game)
 * 
 * 
 */

"use strict";

//Game states
let gameState = "start" //States: "start" , "play1" , "end"

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
const maxScore = 5; //Score to end the game 

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

        //switch to End state once maxScore is reached
        if (score >= maxScore) {
            gameState = "end";
        }

        //Draw End Screen
    } else if (gameState === "end") {
        drawEndScreen();
    }

}


/**
 * Draws the start screen with a start button
 */
function drawStartScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("Frog Game", width / 2, height / 2 - 50);
    textSize(24);
    text("Click to Start", width / 2, height / 2);
    pop();
}

/**
 * Draws the end screen with the score and restart button
 */
function drawEndScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("Game Over", width / 2, height / 2 - 50);
    textSize(24);
    text("Score: " + score, width / 2, height / 2);
    text("Click to Restart", width / 2, height / 2 + 50);
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
        resetFly();
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
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}