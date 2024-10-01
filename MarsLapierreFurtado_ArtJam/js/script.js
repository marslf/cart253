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
 * OH LOOK I DIDN'T DESCRIBE SETUP!!
*/
function setup() {
    createCanvas(600, 400);
}


/**
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
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
    push();
    fill(69, 121, 66);
    ellipse(100, 500, 700, 400)
    ellipse(500, 500, 700, 500)
    pop();

}