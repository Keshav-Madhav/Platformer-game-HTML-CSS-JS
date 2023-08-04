let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

let y = 100;
let velocity = 100;
let lastFrameTime = null;

window.onload = function() {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d');

    context.fillStyle = 'red';
    context.fillRect(100, 100, 100, 100);

    requestAnimationFrame(update);
}

function update(timestamp) {
    let deltaTime = getDeltaTime(timestamp);
    y += velocity * deltaTime;

    context.clearRect(0, 0, board.width, board.height);

    context.fillStyle = 'red';
    context.fillRect(100, y, 100, 100);

    requestAnimationFrame(update);
}



window.addEventListener("resize", function() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
});

function getDeltaTime(timestamp) {
    if (lastFrameTime === null) {
        lastFrameTime = timestamp;
    }
    let deltaTime = (timestamp - lastFrameTime) / 1000; // convert to seconds
    lastFrameTime = timestamp;

    return deltaTime;
}
