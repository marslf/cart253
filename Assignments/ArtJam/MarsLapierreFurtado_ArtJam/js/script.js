/**
 * ART JAM
 * Mars Lapierre-Furtado
 * 
 * DESCRIPTION
 * 
 * Controls:
 * 
 * Uses:
 * p5.js
 * https://p5js.org
 */

"use strict";

//Declaring colour variables for background
var redBackground = 255;
var greenBackground = 127;
var blueBackground = 80;

let stars = [];
const maxStars = 50;

/**
 *DESCRIBE SETUP
*/
function setup() {
    createCanvas(600, 400);
}


/**
 *DESCRIBE WHAT MY DRAW DOES
*/
function draw() {
    noStroke();

    /**
     * Colour of Background
     * 
     * Using the map() function, the program knows that based on the mouseY position,
     * in the range starting at 0 to 320, 
     * to assign a value between the starting (pink) value to the end (blue) value 
     * depending on the individual value for red, green and blue
     */
    redBackground = map(mouseY, 0, 320, 255, 31);
    greenBackground = map(mouseY, 0, 320, 127, 48);
    blueBackground = map(mouseY, 0, 320, 80, 94);
    background(redBackground, greenBackground, blueBackground);


    /**
     * Draws the sun
    */
    push();
    fill(255, 165, 0);
    ellipse(300, mouseY, 64, 64); //moves with mouseY movement
    pop();


    /**
    * Draws the grass
   */
    if (mouseY > 270) {
        // Add new stars
        if (random(1) < 0.2) { // 20% chance each frame to add a new star
            if (stars.length < maxStars) {
                stars.push({
                    x: random(width),
                    y: random(height / 2),
                    size: random(2, 4),
                    opacity: random(102, 255),
                    life: 255 // Start at full life
                });
            }
        }

        // Update and draw stars
        for (let i = stars.length - 1; i >= 0; i--) {
            let star = stars[i];

            // Draw star
            noStroke();
            fill(255, 255, 255, star.opacity * (star.life / 255));
            ellipse(star.x, star.y, star.size);

            // Decrease life
            star.life -= 2;

            // Remove dead stars
            if (star.life <= 0) {
                stars.splice(i, 1);
            }
        }
    } else {
        // Clear stars when moving back to day
        stars = [];

    }



    /**
    * Draws the grass
   */
    push();
    fill(69, 121, 66);
    ellipse(100, 500, 700, 400)
    ellipse(500, 500, 700, 500)
    pop();
}