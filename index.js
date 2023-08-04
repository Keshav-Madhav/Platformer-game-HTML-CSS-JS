let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

let deltaTime = 0;
let lastFrameTime = null;

const gravity = 9.8;

class Player {
    constructor(positon) {
        this.positon = positon
        this.velocity ={
            x:0,
            y:100
        }
        this.height = 100
        this.width = 100
    }

    draw(){
        context.fillStyle = 'red';
        context.fillRect(this.positon.x, this.positon.y, this.width, this.width);
    }

    move() {
        this.draw();
        this.positon.y += this.velocity.y * deltaTime;
        if(this.positon.y + this.height + this.velocity.y*deltaTime < boardHeight){
            this.velocity.y += gravity;
        }
        else{
            this.velocity.y = 0;
        }
    }
}

const player = new Player({x: 100, y: 100});
const player2 = new Player({x: 300, y: 100});


window.onload = function() {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d');

    requestAnimationFrame(update);
}

function update(timestamp) {
    deltaTime = getDeltaTime(timestamp);

    context.clearRect(0, 0, board.width, board.height);

    player.move();
    player2.move();

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

