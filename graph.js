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
        this.edges.forEach(edge => edge.draw());

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
	

    handleMousePressed() {
		let clickedNode = null;
	
		this.nodes.forEach(node => {
			if (node.isHovered()) {
				clickedNode = node;
			}
		});
	
		if (!clickedNode) {
			return ;
		}
		console.log(`Node pressed: ${clickedNode.label}`);

		// If we're in add mode, check if this is the second node to create an edge
		if (this.edgeMode === "add") {
			if(this.loop || this.selectedNode !== clickedNode){
				this.addEdge(clickedNode);
			}
			this.selectedNode = null;
			this.edgeMode = null;
		}

		// If we're in delete mode, remove the edge between the selected node and clicked node
		else if (this.edgeMode === "delete") {
			if(this.loop || this.selectedNode !== clickedNode){
				this.deleteEdge(clickedNode);
			}
			this.selectedNode = null;
			this.edgeMode = null;
		}

		// If the node clicked is the same as the selected one, deselect it
		else if (this.selectedNode === clickedNode) {
			this.deselectNode(clickedNode);
		}

		// if none of those actions were done, select the node
		else{
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
		const newEdge = this.selectedNode === clickedNode
			? new Edge(this.selectedNode, clickedNode) // Self-loop: no sorting needed
			: new Edge(...[this.selectedNode, clickedNode].sort((a, b) => a.label - b.label));
		this.edges.push(newEdge);

		console.log(`Edge created between node ${this.selectedNode.label} and node ${clickedNode.label}`);

		this.selectedNode = null;
		this.edgeMode = null;
		
	}
	

	deleteEdge(clickedNode) {
		if (!this.selectedNode || !clickedNode) return;
	
		// Standardize edge direction for comparison
		const nodePair = [this.selectedNode, clickedNode].sort((a, b) => a.label - b.label);
	
		// Find all edges between the two nodes (order doesn't matter)
		const edgesBetweenNodes = this.edges.filter(edge =>
			[edge.node1, edge.node2].sort((a, b) => a.label - b.label).every((node, index) => node === nodePair[index])
		);
	
		if (edgesBetweenNodes.length > 0) {
			// Delete the last edge in the list (most recently created)
			const edgeToDelete = edgesBetweenNodes[edgesBetweenNodes.length - 1];
			this.edges = this.edges.filter(edge => edge !== edgeToDelete);
			console.log(`Last edge deleted between node ${nodePair[0].label} and node ${nodePair[1].label}`);
	
			// Update indices for remaining edges between these nodes
			const remainingEdges = this.edges.filter(edge =>
				[edge.node1, edge.node2].sort((a, b) => a.label - b.label).every((node, index) => node === nodePair[index])
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
	

    handleMouseDragged(node) {
        if (node) {
            node.x = mouseX;
            node.y = mouseY;
        }
    }
}
