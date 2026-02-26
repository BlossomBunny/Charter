// 1. Configuration
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

let lines = []; 
let selectedNode = null; // For linking nodes

// 2. Create a Node
function createNewNode(type = 'location') {
    const node = document.createElement('div');
    node.className = `node ${type}`;
    node.id = 'node-' + Date.now();
    node.style.left = '100px';
    node.style.top = '100px';
    
    node.innerHTML = `
        <div class="node-controls">
            <button onclick="startLink('${node.id}')">🔗</button>
            <button onclick="this.parentElement.parentElement.remove()">❌</button>
        </div>
        <input placeholder="Name..." class="nodrag">
        <textarea placeholder="Description..." class="nodrag"></textarea>
    `;
    
    document.getElementById('canvas').appendChild(node);
    makeDraggable(node);
}

// 3. Spider Diagram Math (The "Smart" Function)
function applySpiderLayout() {
    const nodes = document.querySelectorAll('.node');
    const radius = 300;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    nodes.forEach((node, i) => {
        // Calculate position on the circle
        const angle = (i / nodes.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle) - 100; // Offset by half width
        const y = centerY + radius * Math.sin(angle) - 50;  // Offset by half height
        
        node.style.left = x + 'px';
        node.style.top = y + 'px';
    });
    
    // Refresh all lines after moving nodes
    lines.forEach(line => line.position());
}

// 4. Drawing Lines (Relationship Logic)
function startLink(nodeId) {
    const nodeEl = document.getElementById(nodeId);
    
    if (!selectedNode) {
        selectedNode = nodeEl;
        nodeEl.style.borderColor = "#007bff"; // Highlight first selection
    } else if (selectedNode === nodeEl) {
        selectedNode.style.borderColor = ""; // Deselect
        selectedNode = null;
    } else {
        // Create the line
        const newLine = new LeaderLine(selectedNode, nodeEl, {
            color: '#8b4513',
            size: 3,
            path: 'fluid',
            startPlug: 'disc',
            endPlug: 'arrow'
        });
        
        lines.push(newLine);
        selectedNode.style.borderColor = "";
        selectedNode = null;
    }
}

// 5. Dragging Logic
function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = (e) => {
        if (e.target.classList.contains('nodrag')) return; // Don't drag when typing
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        document.onmousemove = (e) => {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            lines.forEach(line => line.position()); // Keep lines attached
        };
    };
}
