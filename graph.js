class Graph {
    constructor(params) {
        this.nodes = [];
        this.edges = [];
        this.selectedNode = null; // Track selected node
        this.edgeMode = null; // Can be 'add' or 'delete'
		this.index = 0;
		
		this.directed = params.directed;
        this.loop = params.loop;
        this.multiEdge = params.multiedge;
        this.weight = params.weighted;
    }

    addNode(x, y, radius) {
        const node = new Node(x, y, radius, this.index++);
        this.nodes.push(node);
    }

    draw() {
        // Draw all edges first
        this.edges.forEach(edge => edge.draw(this.directed));

        // Draw all nodes
        this.nodes.forEach(node => node.draw());

        // Highlight the selected node
        if (this.selectedNode) {
            noFill();
            stroke(0, 255, 0); // Green outline for selected nodes
            strokeWeight(3);
            ellipse(this.selectedNode.x, this.selectedNode.y, this.selectedNode.radius * 2 + 6);
        }
    }
	

    handleMousePressed(event) {
		if (event.button === 2) {
			// Do nothing here to prevent handling right-click (it's already handled in sketch.js)
			return;
		}
	
		let clickedNode = null;
	
		this.nodes.forEach(node => {
			if (node.isHovered()) {
				clickedNode = node;
			}
		});
	
		if (!clickedNode) {
			return;
		}
		console.log(`Node pressed: ${clickedNode.label}`);
	
		// If we're in add mode, check if this is the second node to create an edge
		if (this.edgeMode === "add") {
			if (this.loop || this.selectedNode !== clickedNode) {
				this.addEdge(clickedNode);
			}
			this.selectedNode = null;
			this.edgeMode = null;
		}
	
		// If we're in delete mode, remove the edge between the selected node and clicked node
		else if (this.edgeMode === "delete") {
			if (this.loop || this.selectedNode !== clickedNode) {
				this.deleteEdge(clickedNode);
			}
			this.selectedNode = null;
			this.edgeMode = null;
		}
	
		// If the node clicked is the same as the selected one, deselect it
		else if (this.selectedNode === clickedNode) {
			this.deselectNode(clickedNode);
		}
	
		// If none of those actions were done, select the node
		else {
			this.selectNode(clickedNode);
		}
	}
	
	
	
	selectNode(clickedNode){
		console.log("Selected node:", clickedNode.label);
		this.selectedNode = clickedNode;
	}

	deselectNode(clickedNode){
		console.log("Deselected node:", clickedNode.label);
		this.selectedNode = null; // Deselect
	}

	addEdge(clickedNode) {
		// Count existing edges between the two nodes
		const existingEdges = this.edges.filter(edge =>
			(edge.node1 === this.selectedNode && edge.node2 === clickedNode) ||
			(edge.node1 === clickedNode && edge.node2 === this.selectedNode)
		);

		if(existingEdges != 0 && !this.multiEdge){
			this.selectedNode = null;
			this.edgeMode = null;
			return ;
		}

		const totalEdges = existingEdges.length + 1;

		// Assign indices to all edges between these nodes
		existingEdges.forEach((edge, index) => {
			edge.index = index + 1;
			edge.totalEdges = totalEdges;
		});

		// Add the new edge
		var newEdge;
		if((this.selectedNode === clickedNode) || (this.directed)){
			newEdge = new Edge(this.selectedNode, clickedNode) // Self-loop or directed edge: no sorting needed
		}
		else{
			newEdge = new Edge(...[this.selectedNode, clickedNode].sort((a, b) => a.label - b.label));
		}

		this.edges.push(newEdge);

		console.log(`Edge created between node ${this.selectedNode.label} and node ${clickedNode.label}`);

		this.selectedNode = null;
		this.edgeMode = null;
		
	}
	
	deleteEdge(clickedNode) {
		if (!this.selectedNode || !clickedNode) return;
	
		let nodePair;
		
		if (this.directed) {
			// For directed graphs, don't sort nodes, preserve direction
			nodePair = [this.selectedNode, clickedNode];
		} else {
			// For undirected graphs, sort the nodes to make A->B and B->A the same
			nodePair = [this.selectedNode, clickedNode].sort((a, b) => a.label - b.label);
		}
	
		// Find all edges between the two nodes (order matters for directed, doesn't for undirected)
		const edgesBetweenNodes = this.edges.filter(edge =>
			(this.directed ? 
				(edge.node1 === nodePair[0] && edge.node2 === nodePair[1]) :
				[edge.node1, edge.node2].sort((a, b) => a.label - b.label).every((node, index) => node === nodePair[index])
			)
		);
	
		if (edgesBetweenNodes.length > 0) {
			// Delete the last edge in the list (most recently created)
			const edgeToDelete = edgesBetweenNodes[edgesBetweenNodes.length - 1];
			this.edges = this.edges.filter(edge => edge !== edgeToDelete);
			console.log(`Last edge deleted between node ${nodePair[0].label} and node ${nodePair[1].label}`);
	
			// Update indices for remaining edges between these nodes
			const remainingEdges = this.edges.filter(edge =>
				(this.directed ?
					(edge.node1 === nodePair[0] && edge.node2 === nodePair[1]) :
					[edge.node1, edge.node2].sort((a, b) => a.label - b.label).every((node, index) => node === nodePair[index])
				)
			);
	
			remainingEdges.forEach((edge, index) => {
				edge.index = index + 1;
				edge.totalEdges = remainingEdges.length;
			});
		}
	
		this.selectedNode = null; // Clear selection after deleting the edge
		this.edgeMode = null; // Exit delete mode
	}
	
    activateEdgeMode(action) {
		if (action === "add") {
			console.log("Edge mode activated: add");
			this.edgeMode = "add";
		} else if (action === "delete") {
			console.log("Edge mode activated: delete");
			this.edgeMode = "delete";
		}
	}

    deleteNode(nodeToDelete) {
		// Remove the node from the list of nodes
		this.nodes = this.nodes.filter(node => node !== nodeToDelete);
	
		// Remove all edges associated with this node
		this.edges = this.edges.filter(edge => edge.node1 !== nodeToDelete && edge.node2 !== nodeToDelete);
	
		// If the selected node is the one being deleted, reset the selection
		if (this.selectedNode === nodeToDelete) {
			console.log("Selected node deleted, resetting selection.");
			this.selectedNode = null;
		}
	
		// You might want to reset the edge mode in case delete was triggered from it
		this.edgeMode = null;
	}

	showContextMenu(clickedNode) {
		// Create a container for the context menu
		const menuContainer = createDiv()
			.style('position', 'absolute')
			.style('top', `${clickedNode.y + 20}px`)  // Position slightly below the node
			.style('left', `${clickedNode.x + 20}px`) // Position slightly to the right of the node
			.style('background-color', '#FFF')
			.style('border', '1px solid #000')
			.style('padding', '10px')
			.style('border-radius', '8px')
			.style('box-shadow', '0 8px 16px rgba(0, 0, 0, 0.3)')
			.style('z-index', '10');
	
		// Create a button inside the context menu
		const button1 = createButton('Hello')
			.mousePressed(() => this.doSomething())
			.style('padding', '5px 10px')
			.style('margin', '5px 0')
			.style('background-color', '#32CD32') // Light green color
			.style('color', '#fff')
			.style('border', 'none')
			.style('border-radius', '5px')
			.parent(menuContainer);
	
		// You can add more buttons here, for now, we add one "Hello" button
		// Add as many buttons as needed here
	
		// Close the menu when clicking anywhere outside
		this.addCloseListener(menuContainer);
	}
	
	// Function to close the context menu when clicking outside
	addCloseListener(menuContainer) {
		// Close the context menu if the user clicks outside
		const closeMenu = () => {
			menuContainer.remove();
			// Remove the event listener to avoid memory leaks
			document.removeEventListener('click', closeMenu);
		};
	
		// Event listener for click outside
		document.addEventListener('click', closeMenu);
	}
	
	doSomething() {
		// Process logic inside the Graph class
		const result = "Hello, World!"; // Replace this with your actual logic
	
		// Display the result in a modal
		this.showModal(result);
	}

	showModal(message) {
		// Create the modal container
		const modalContainer = createDiv()
			.style('position', 'fixed')
			.style('top', '50%')
			.style('left', '50%')
			.style('transform', 'translate(-50%, -50%)')
			.style('background-color', '#FFF')
			.style('border', '1px solid #000')
			.style('padding', '20px')
			.style('border-radius', '10px')
			.style('box-shadow', '0 8px 16px rgba(0, 0, 0, 0.3)')
			.style('z-index', '1000')
			.style('opacity', '0') // Start fully transparent
			.style('transition', 'opacity 0.3s ease-out'); // Add transition for smooth animation
	
		// Add the message
		createDiv(message)
			.style('margin-bottom', '15px')
			.style('font-size', '16px')
			.parent(modalContainer);
	
		// Add a "Close" button
		const closeButton = createButton('Close')
			.style('padding', '5px 10px')
			.style('background-color', '#FF6347') // Tomato color for the button
			.style('color', '#FFF')
			.style('border', 'none')
			.style('border-radius', '5px')
			.parent(modalContainer)
			.mousePressed(() => modalContainer.remove());
	
		// Append modal to the body and trigger the animation
		setTimeout(() => modalContainer.style('opacity', '1'), 10); // Delay slightly to ensure smooth transition
	}
	
	
	
	

    handleMouseDragged(node) {
        if (node) {
            node.x = mouseX;
            node.y = mouseY;
        }
    }
}
