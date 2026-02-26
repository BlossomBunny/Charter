// 1. Setup Supabase (Replace with your actual keys later)
const _supabase = supabase.createClient('YOUR_URL', 'YOUR_KEY');

// 2. Add a Draggable Node
function addNode(type) {
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = '100px';
    node.style.top = '100px';
    node.innerHTML = `
        <input type="text" placeholder="Name...">
        <textarea style="width:100%; height:50px;"></textarea>
    `;
    
    document.getElementById('canvas').appendChild(node);
    makeDraggable(node);
}

// 3. Simple Drag Logic
function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
