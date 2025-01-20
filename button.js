class Button {
    constructor(x, y, width, height, label, onClick) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.onClick = onClick;
    }

    draw() {
        // Draw the button
        fill(200); // Button color
        stroke(0);
        rect(this.x, this.y, this.width, this.height);

        // Draw the label
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        text(this.label, this.x + this.width / 2, this.y + this.height / 2);
    }

    isHovered() {
        // Check if the mouse is over the button
        return 	mouseX > this.x && mouseX < this.x + this.width &&
				mouseY > this.y && mouseY < this.y + this.height;
    }

    handleMousePressed() {
        // Check if clicked
        if (this.isHovered() && this.onClick) {
            this.onClick(); // Call the assigned function
        }
    }
}