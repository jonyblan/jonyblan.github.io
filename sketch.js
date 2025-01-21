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
        <h2 style="font-family: 'Poppins', sans-serif; color: #fff;">Configuracion del grafo</h2>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="directed"> Dirijido (A -> B ≠ B -> A)
        </label><br>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="loop"> Permitir lazos (A -> A)
        </label><br>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="multiedge"> Permitir multi-aristas
        </label><br>
        <label style="font-family: 'Poppins', sans-serif; color: #fff;">
            <input type="checkbox" id="weighted"> Aristas con peso (no implementado)
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
        ">Empezar</button>
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
    addNodeButton = new Button(100, 100, 150, 50, "Añadir vertice", () => {
        const x = random(50, width - 50);
        const y = random(50, height - 50);
        graph.addNode(x, y, 30);
    });

    addEdgeButton = new Button(100, 200, 150, 50, "Añadir arista", () => {
        if (graph.selectedNode) {
            graph.activateEdgeMode("add");
        }
    });

    deleteEdgeButton = new Button(100, 300, 150, 50, "Borrar arista", () => {
        if (graph.selectedNode) {
            graph.activateEdgeMode("delete");
        }
    });

    deleteNodeButton = new Button(100, 400, 150, 50, "Borrar nodo", () => {
        if (graph.selectedNode) {
            graph.deleteNode(graph.selectedNode);
        }
    });
}

function mousePressed(event) {
    if (!graph) {
        return;
    }

    addNodeButton.handleMousePressed();
    addEdgeButton.handleMousePressed();
    deleteEdgeButton.handleMousePressed();
    deleteNodeButton.handleMousePressed();

    // Check for right-click (button 2)
    if (event.button === 2) {
        // Prevent the default context menu
        event.preventDefault();
        event.stopPropagation();

        // Check if a node is clicked
        let clickedNode = null;
        graph.nodes.forEach(node => {
            if (node.isHovered()) {
                clickedNode = node;
            }
        });

        if (clickedNode) {
            // Show the context menu for the clicked node
            graph.showContextMenu(clickedNode);
        }
    } else {
        // Handle regular left-clicks and other interactions
        graph.handleMousePressed(event);
    }

    // Handle node dragging (if not a right-click)
    if (event.button !== 2) {
        graph.nodes.forEach(node => {
            if (node.isHovered()) {
                nodePressed = node;
            }
        });

        isDragging = true;
    }
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
