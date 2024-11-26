/**
 * Title of Project
 * Mars Lapierre-Furtado
 * 
 * PROJECT DESCRIPTION
 */

"use strict";

// Game variables
let gameState = "default"; //Game States: "start", "default", "win"
let playerX, playerY; //Player movement/position
let currentRoom = { x: 1, y: 1 }; //Room that the player is/starts in 
let roomGrid = []; //World room grid

/**
 * SETUP DESCRIPTION
 * 
 * -create canvas 
 * -player starts in the middle
 * -create room grid
 * 
*/
function setup() {
    createCanvas(600, 600);

    // Initialize player position
    playerX = width / 2;
    playerY = height / 2;

    // Create the room grid
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            let room = {
                x: x,
                y: y,
                color: color(random(255), random(255), random(255)),
                exits: {
                    top: y > 0,
                    bottom: y < 2,
                    left: x > 0,
                    right: x < 2
                }
            };
            roomGrid.push(room);
        }
    }
}



/**
 * DRAW DESCRIPTION
 * 
 * -create the room the player is in
 * -create the player
 * -move the player with WASD input
 * 
 * 
*/
function draw() {
    // Clear the canvas
    background(220);

    if (gameState === "default") {
        // Draw the walls and doorways
        fill(0);
        rect(0, 0, width, 20); // Top wall
        rect(0, height - 20, width, 20); // Bottom wall
        rect(0, 0, 20, height); // Left wall
        rect(width - 20, 0, 20, height); // Right wall

        // Draw the doorways
        if (currentRoomData.exits.top) {
            fill(255, 255, 0);
            rect(width / 2 - 20, 0, 40, 20);
        }
        if (currentRoomData.exits.bottom) {
            fill(255, 255, 0);
            rect(width / 2 - 20, height - 20, 40, 20);
        }
        if (currentRoomData.exits.left) {
            fill(255, 255, 0);
            rect(0, height / 2 - 20, 20, 40);
        }
        if (currentRoomData.exits.right) {
            fill(255, 20);
            rect(width - 20, height / 2 - 20, 20, 40);
        }


        // Draw the current room
        let currentRoomIndex = currentRoom.x + currentRoom.y * 3;
        let currentRoomData = roomGrid[currentRoomIndex];
        fill(currentRoomData.color);
        rect(0, 0, width, height);

        // Draw the player
        fill(255, 0, 0);
        rect(playerX, playerY, 20, 20);

        // Handle player movement
        handlePlayerMovement();
    }
}


/**
 * PLAYER MOVEMENT
 * 
 * -
 * 
*/
function handlePlayerMovement() {
    // Move the player based on WASD input
    if (keyIsDown('W')) { // W
        if (currentRoomData.exits.top) {
            playerY -= 2;
        }
    }
    if (keyIsDown('S')) { // S
        if (currentRoomData.exits.bottom) {
            playerY += 2;
        }
    }
    if (keyIsDown('A')) { // A
        if (currentRoomData.exits.left) {
            playerX -= 2;
        }
    }
    if (keyIsDown('D')) { // D
        if (currentRoomData.exits.right) {
            playerX += 2;
        }
    }

    // Check if the player has crossed a room boundary
    if (playerX < 20) {
        if (currentRoomData.exits.left) {
            currentRoom.x--;
            playerX = width - 20;
        } else {
            playerX = 20;
        }
    } else if (playerX > width - 20) {
        if (currentRoomData.exits.right) {
            currentRoom.x++;
            playerX = 20;
        } else {
            playerX = width - 20;
        }
    } else if (playerY < 20) {
        if (currentRoomData.exits.top) {
            currentRoom.y--;
            playerY = height - 20;
        } else {
            playerY = 20;
        }
    } else if (playerY > height - 20) {
        if (currentRoomData.exits.bottom) {
            currentRoom.y++;
            playerY = 20;
        } else {
            playerY = height - 20;
        }
    }
}

/**
 * START SCREEN
 */
function drawStartScreen() {
    push();
    textAlign(CENTER, CENTER);
    textSize(34);
    fill(255);
    text("Game Title", width / 2, height / 2 - 50);
    textSize(24);
    text("Click to Start", width / 2, height / 2);
    pop();
};

//MOUSE PRESSED FUNCTION
function mousePressed() {
    if (gameState === "start") {
        gameState = "default"; //When in game state start switch to state play 1)
    };
};
