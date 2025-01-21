class Edge {
    constructor(node1, node2, index = 0, totalEdges = 1) {
        this.node1 = node1;
        this.node2 = node2;
        this.index = index; // Position of this edge among all edges between these nodes
        this.totalEdges = totalEdges; // Total number of edges between these nodes
    }

	draw(directed) {
        const { x: x1, y: y1 } = this.node1;
        const { x: x2, y: y2 } = this.node2;

        // Check if the edge is a self-loop
        if (this.node1 === this.node2) {
            this.drawSelfLoop(x1, y1);
        } else {
            this.drawStraightLine(x1, y1, x2, y2, directed);
        }
    }
	
	drawStraightLine(x1, y1, x2, y2, directed) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = dist(x1, y1, x2, y2);

        // Adjust start and end points to stop at the edge of the nodes
        const radius1 = this.node1.radius;
        const radius2 = this.node2.radius;

        const startX = x1 + (radius1 / distance) * dx;
        const startY = y1 + (radius1 / distance) * dy;
        const endX = x2 - (radius2 / distance) * dx;
        const endY = y2 - (radius2 / distance) * dy;

        // Calculate perpendicular offset
        const perpendicular = createVector(-dy / distance, dx / distance);
        const offsetMagnitude = 10 * Math.ceil(this.index / 2); // Adjust offset size
        const offsetDirection = this.index % 2 === 0 ? 1 : -1; // Alternate offset directions
        const offset = p5.Vector.mult(perpendicular, offsetMagnitude * offsetDirection);

        // Apply offset to start and end points
        const offsetStartX = startX + offset.x;
        const offsetStartY = startY + offset.y;
        const offsetEndX = endX + offset.x;
        const offsetEndY = endY + offset.y;

        // Draw the line with offset
        stroke(255);
        strokeWeight(2);
        line(offsetStartX, offsetStartY, offsetEndX, offsetEndY);

		if(directed){
			// Draw arrowhead with offset applied
			this.drawArrowhead(offsetEndX, offsetEndY, dx, dy);
		}
    }



    drawSelfLoop(x, y) {
        const loopRadius = 30 + this.index * 10; // Radius of the loop, adjusted for multiple loops
        const offsetAngle = PI / 4; // Offset to position the loop to the side of the node

        noFill();
        stroke(255);
        strokeWeight(2);

        // Draw a circle tangent to the node's center
        const offsetX = loopRadius * cos(offsetAngle);
        const offsetY = loopRadius * sin(offsetAngle);
        ellipse(x + offsetX, y - offsetY, loopRadius * 2);
    }

    drawArrowhead(x, y, dx, dy) {
        const arrowSize = 10;

        fill(255);
        noStroke();

        // Calculate angle based on the direction vector (dx, dy)
        const angle = atan2(dy, dx);

        // Draw the arrowhead as a triangle
        push();
        translate(x, y);
        rotate(angle);
        beginShape();
        vertex(0, 0);
        vertex(-arrowSize, arrowSize / 2);
        vertex(-arrowSize, -arrowSize / 2);
        endShape(CLOSE);
        pop();
    }
}
