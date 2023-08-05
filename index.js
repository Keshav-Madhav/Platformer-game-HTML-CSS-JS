let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

let deltaTime = 0;
let lastFrameTime = null;

const floorCollisions2D = [];
for(let i=0; i<floorCollisions.length; i+=36){
    floorCollisions2D.push(floorCollisions.slice(i, i+36));
}

const collisionBlocks = [];

floorCollisions2D.forEach((row, y)=>{
    row.forEach((symbol, x)=>{
        if(symbol === 202){
            collisionBlocks.push(new CollisionBlock({position: {x: x * 16 , y: y * 16}}));
        }
    })
});

const platformCollisions2D = [];
for(let i=0; i<platformCollisions.length; i+=36){
    platformCollisions2D.push(platformCollisions.slice(i, i+36));
}

const platformBlocks = [];

platformCollisions2D.forEach((row, y)=>{
    row.forEach((symbol, x)=>{
        if(symbol === 202){
            platformBlocks.push(new CollisionBlock({position:{x: x*16, y: y*16}}));
        }
    })
});

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

const gravity = 6.8;

const background = new Sprite({imageSrc: 'background', position: {x: 0, y: 0}, size: {width: boardWidth, height: boardHeight}});

const player = new Player({
    position:{x: boardWidth/8, y: boardHeight/2.5},
    collisionBlocks,
});

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

    //making collision blocks
    context.save();
    context.scale(4, 4);
    context.translate(0, -background.image.height + board.height/4)
    background.render();
    collisionBlocks.forEach((collisionBlock)=>{
        collisionBlock.render();
    });
    platformBlocks.forEach((collisionBlock)=>{
        collisionBlock.render();
    });

    //player movement
    player.move();

    player.velocity.x = 0;
    if(key.d.pressed){
        player.velocity.x = 300/4;
    }
    else if(key.a.pressed){
        player.velocity.x = -300/4;
    }
    context.restore();

    

    requestAnimationFrame(update);
}

//when the key is pressed
window.addEventListener("keydown", (e)=> {
    if(e.key === 'ArrowUp' || e.key === 'w'){
        player.velocity.y = -350;
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

