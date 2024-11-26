/**
 * Title of Project
 * Mars Lapierre-Furtado
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

// Game variables
let playerX, playerY;
let currentRoom = { x: 1, y: 1 };
let roomGrid = [];

/**
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
*/
function setup() {
    createCanvas(400, 400);

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
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
*/
function draw() {
    // Clear the canvas
    background(220);

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

function handlePlayerMovement() {
    // Move the player based on WASD input
    if (keyIsDown(87)) { // W
        playerY -= 5;
    }
    if (keyIsDown(83)) { // S
        playerY += 5;
    }
    if (keyIsDown(65)) { // A
        playerX -= 5;
    }
    if (keyIsDown(68)) { // D
        playerX += 5;
    }

    // Check if the player has crossed a room boundary
    if (playerX < 0) {
        if (currentRoomData.exits.left) {
            currentRoom.x--;
            playerX = width - 20;
        } else {
            playerX = 0;
        }
    } else if (playerX > width - 20) {
        if (currentRoomData.exits.right) {
            currentRoom.x++;
            playerX = 20;
        } else {
            playerX = width - 20;
        }
    } else if (playerY < 0) {
        if (currentRoomData.exits.top) {
            currentRoom.y--;
            playerY = height - 20;
        } else {
            playerY = 0;
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