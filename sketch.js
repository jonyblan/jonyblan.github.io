let graph;
let addNodeButton, addEdgeButton, deleteEdgeButton, deleteNodeButton;
let isDragging = false;
let nodePressed = null;
let graphParameters = null;
let startGraphButton;

function setup() {
    createCanvas(windowWidth, windowHeight);

	createGraphSetupForm();
}

function draw() {
    background(0);

    // If graph parameters are defined, show the graph interface
    if (graphParameters) {
        graph.draw();
    }

    // Draw buttons only after the graph parameters are set
    if (graphParameters) {
        addNodeButton.draw();
        addEdgeButton.draw();
        deleteEdgeButton.draw();
        deleteNodeButton.draw();
    }
}

function createGraphSetupForm() {
    // Create a container for the form and center it
    const formContainer = createDiv().style('text-align', 'center')
        .style('position', 'absolute')
        .style('top', '50%')
        .style('left', '50%')
        .style('transform', 'translate(-50%, -50%)') // This will center the form
        .style('width', '350px') // Adjust the width to your liking
        .style('padding', '20px')
        .style('background-color', '#007BFF') // Blue background
        .style('border-radius', '15px')
        .style('box-shadow', '0 8px 16px rgba(0, 0, 0, 0.3)');

    // Add form elements to the form container
    formContainer.html(`
        <h2 style="font-family: 'Poppins', sans-serif; color: #fff;">Graph Configuration</h2>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="directed"> Directed (A -> B ≠ B -> A)
        </label><br>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="loop"> Allow Loops (A -> A)
        </label><br>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="multiedge"> Allow Multiple Edges
        </label><br>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="weighted"> Weighted Edges
        </label><br>
        <button id="startGraphButton" style="
            background-color: #32CD32; /* Light green */
            color: white;
            font-family: 'Poppins', sans-serif;
            font-size: 18px;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        ">Start Graph</button>
    `);

    // Start button logic
    const startButton = select('#startGraphButton');
    startButton.mousePressed(() => {
        // Read the input values
        graphParameters = {
            directed: select('#directed').elt.checked,
            loop: select('#loop').elt.checked,
            multiedge: select('#multiedge').elt.checked,
            weighted: select('#weighted').elt.checked,
        };

        // Now we create the graph with the parameters selected by the user
        graph = new Graph(graphParameters);

        // Remove the form and display the rest of the interface
        formContainer.remove();
        createGraphControlButtons(); // Assuming you have a function to create other controls
    });
}



// Create buttons for graph operations
function createGraphControlButtons() {
    // Create the buttons as before, interacting with the graph object
    addNodeButton = new Button(100, 100, 150, 50, "Add Node", () => {
        const x = random(50, width - 50);
        const y = random(50, height - 50);
        graph.addNode(x, y, 30);
    });

    addEdgeButton = new Button(100, 200, 150, 50, "Add Edge", () => {
        if (graph.selectedNode) {
            graph.activateEdgeMode("add");
        }
    });

    deleteEdgeButton = new Button(100, 300, 150, 50, "Delete Edge", () => {
        if (graph.selectedNode) {
            graph.activateEdgeMode("delete");
        }
    });

    deleteNodeButton = new Button(100, 400, 150, 50, "Delete Node", () => {
        if (graph.selectedNode) {
            graph.deleteNode(graph.selectedNode);
        }
    });
}

function mousePressed() {
	if(!graph){
		return ;
	}
	
	addNodeButton.handleMousePressed();
	addEdgeButton.handleMousePressed();
	deleteEdgeButton.handleMousePressed();
	deleteNodeButton.handleMousePressed();
	
	graph.handleMousePressed();
    

    // Handle node dragging
    graph.nodes.forEach(node => {
        if (node.isHovered()) {
            nodePressed = node;
        }
    });

    isDragging = true;
}

function mouseDragged() {
    if (isDragging && nodePressed) {
        graph.handleMouseDragged(nodePressed);
    }
}

function mouseReleased() {
    isDragging = false;
    nodePressed = null;
}
