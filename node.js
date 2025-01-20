class Node {
    constructor(x, y, radius = 20, label = -1) {
        this.x = x; // x position
        this.y = y; // y position
        this.radius = radius; // Node size
        this.label = label; // Optional label or ID for the node
    }
	
	isHovered() {
        // Check if the mouse is within the node's radius
        return dist(mouseX, mouseY, this.x, this.y) < this.radius;
    }

    // Method to draw the node
    draw() {
        fill(100, 150, 255); // Color of the node
        stroke(88, 57, 39); // Node outline color
        ellipse(this.x, this.y, this.radius * 2); // Draw the node as a circle

        // Optional: draw the label in the center of the node
        fill(0); // Text color
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.label, this.x, this.y);
    }
}