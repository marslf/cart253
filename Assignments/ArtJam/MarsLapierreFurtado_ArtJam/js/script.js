/**
 * ETERNAL DUSK
 * Mars Lapierre-Furtado
 * 
 * DESCRIPTION
 * - Interactive sunset / sunrise scene
 * - Background color shifts from pink to dark blue based on the sun's position (mouseY)
 * - Stars appear when the sun sets and disappear as it rises
 * - Three clouds move across the sky at different speeds, reappearing on the left side
 * - User interaction: Sun moves up and down with mouseY, clouds change visibility with mouseX
 * - map() function used to transition colors smoothly
 * - Conditional logic controls star appearance and cloud visibility
 * 
 * Controls:
 * Move the curser up and down to move the sun and make the stars appear
 * Move the curser onto the sun to make the clouds disapear 
 * 
 * Uses:
 * p5.js
 * https://p5js.org
 */

"use strict";

//Variables for background colour
var redBackground = 255;
var greenBackground = 127;
var blueBackground = 80;

//Variables for the stars
var stars = [];
const maxStars = 50;

//Variables for the clouds
var aCloudX = 0;
var bCloudX = 450;
var cCloudX = 225;


/**
 * SETUP : create the canvas with the proper dimensions
*/
function setup() {
    createCanvas(600, 400);
}


/**
 * DRAW:
 * - Change the background colour depending on mouseY
 * - Draw the sun and make it move on the Y axis with mouseY
 * - Draw the stars that eventually die and continually appear as long as mouseY > 270
 * - Draw the clouds and make them move across the canvas from left to right at different speeds and restart once they diseappear 
 * - Draw the grass using two large green ellipses at the bottom of the canvas
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
    * Draws the stars
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
    * Draws the clouds
   */
    if (mouseX < 264 || mouseX > 330) { //if the curser is touching the sun then the clouds disappear and once it moves away they will reappear 
        push();
        fill(225, 247, 252, 50);
        ellipse(aCloudX, 130, 130, 50);
        ellipse(bCloudX, 100, 160, 75);
        ellipse(cCloudX, 115, 100, 40);
        pop();

        // Clouds move from left to right
        aCloudX = aCloudX + 0.5
        bCloudX = bCloudX + 0.8
        cCloudX = cCloudX + 1

        // Clouds reappear on the left when reach the right side 
        if (aCloudX > 700) {
            aCloudX = -60;
        }
        if (bCloudX > 700) {
            bCloudX = -70;
        }
        if (cCloudX > 700) {
            cCloudX = -60;
        }
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
