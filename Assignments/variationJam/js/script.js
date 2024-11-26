/**
 * Title of Project
 * Mars Lapierre-Furtado
 * 
 * PROJECT DESCRIPTION
 */

"use strict";

// Game variables
let gameState = "start"; //Game States: "start", "default", "win"
let playerX, playerY; //Player movement/position
let currentRoom = { x: 1, y: 1 }; //Room that the player is/starts in 
let roomGrid = []; //World room grid
let currentRoomData; // Initialized in setup()

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

    // Initialize currentRoomData
    updateCurrentRoomData();

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
        drawRooms
        drawPlayer

        handlePlayerMovement(); // Handle player movement
    } else if (gameState === "start") {
        drawStartScreen();
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
    if (keyIsDown(87)) { // W
        if (currentRoomData.exits.top) {
            playerY -= 2;
        }
    }
    if (keyIsDown(83)) { // S
        if (currentRoomData.exits.bottom) {
            playerY += 2;
        }
    }
    if (keyIsDown(65)) { // A
        if (currentRoomData.exits.left) {
            playerX -= 2;
        }
    }
    if (keyIsDown(68)) { // D
        if (currentRoomData.exits.right) {
            playerX += 2;
        }
    }

    // Check if the player has crossed a room boundary
    if (playerX < 20) {
        if (currentRoomData.exits.left) {
            currentRoom.x--;
            playerX = width - 20;
            updateCurrentRoomData();
        } else {
            playerX = 20;
        }
    } else if (playerX > width - 20) {
        if (currentRoomData.exits.right) {
            currentRoom.x++;
            playerX = 20;
            updateCurrentRoomData();
        } else {
            playerX = width - 20;
        }
    } else if (playerY < 20) {
        if (currentRoomData.exits.top) {
            currentRoom.y--;
            playerY = height - 20;
            updateCurrentRoomData();
        } else {
            playerY = 20;
        }
    } else if (playerY > height - 20) {
        if (currentRoomData.exits.bottom) {
            currentRoom.y++;
            playerY = 20;
            updateCurrentRoomData();
        } else {
            playerY = height - 20;
        }
    }
}

/**
 * DRAW START SCREEN FUNCTION
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


/**
 * DRAW ROOMS FUNCTION
 */
function drawRooms() {
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
        fill(255, 255, 0);
        rect(width - 20, height / 2 - 20, 20, 40);
    }

    // Draw the current room
    fill(currentRoomData.color);
    rect(20, 20, width - 40, height - 40);
}

/**
 * DRAW PLAYER FUNCTION
 */
function drawPlayer() {
    fill(0, 200, 50);
    rect(playerX, playerY, 20, 20);
}

//MOUSE PRESSED FUNCTION
function mousePressed() {
    if (gameState === "start") {
        gameState = "default"; //When in game state start switch to state play 1)
    };
};


function updateCurrentRoomData() {
    let currentRoomIndex = currentRoom.x + currentRoom.y * 3;
    currentRoomData = roomGrid[currentRoomIndex];
}