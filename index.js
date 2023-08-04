let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

let deltaTime = 0;
let lastFrameTime = null;

const key={
    d:{
        pressed: false,
    },
    a:{
        pressed: false,
    },
    w:{
        pressed: false,
    }
}

const gravity = 9.8;

//player class
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

        this.positon.x += this.velocity.x * deltaTime;
    }
}

//sprite class
class Sprite{
    constructor({imageSrc, position, size}){
        this.image = new Image();
        this.image.src = './Assets/'+imageSrc+'.png';
        this.position = position;
        this.size = size;
    }

    draw(){
        if(!this.image){
            return;
        }
        context.drawImage(this.image, this.position.x, this.position.y);
    }

    move(){
        this.draw();
    }
}

const background = new Sprite({imageSrc: 'background', position: {x: 0, y: 0}, size: {width: boardWidth, height: boardHeight}});

const player = new Player({x: 100, y: 0});
const player2 = new Player({x: 300, y: 0});

//when the window is loaded
window.onload = function() {
    board = document.getElementById('board');
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext('2d');

    requestAnimationFrame(update);
}

//update the game
function update(timestamp) {
    deltaTime = getDeltaTime(timestamp);

    context.clearRect(0, 0, board.width, board.height);

    context.save();
    context.scale(4, 4);
    context.translate(0, -background.image.height + board.height/4)
    background.move();
    context.restore();

    player.move();
    player2.move();

    player.velocity.x = 0;
    if(key.d.pressed){
        player.velocity.x = 300;
    }
    else if(key.a.pressed){
        player.velocity.x = -300;
    }

    requestAnimationFrame(update);
}

//when the key is pressed
window.addEventListener("keydown", (e)=> {
    if(e.key === 'ArrowUp' || e.key === 'w'){
        player.velocity.y = -1000;
    }
    if(e.key === 'ArrowRight' || e.key === 'd'){
        key.d.pressed = true;
    }
    if(e.key === 'ArrowLeft' || e.key === 'a'){
        key.a.pressed = true;
    }
});

//when the key is released
window.addEventListener("keyup", (e)=> {
    if(e.key === 'ArrowRight' || e.key === 'd'){
        key.d.pressed = false;
    }
    if(e.key === 'ArrowLeft' || e.key === 'a'){
        key.a.pressed = false;
    }
});

//resize the canvas when the window is resized
window.addEventListener("resize", function() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
});

//function to calculater delta time
function getDeltaTime(timestamp) {
    if (lastFrameTime === null) {
        lastFrameTime = timestamp;
    }
    let deltaTime = (timestamp - lastFrameTime) / 1000; // convert to seconds
    lastFrameTime = timestamp;

    return deltaTime;
}

