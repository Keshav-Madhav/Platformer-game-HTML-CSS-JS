let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

let deltaTime = 0;
let lastFrameTime = null;

let gamePaused = false;
let userPaused = false;

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
            platformBlocks.push(new CollisionBlock({position:{x: x*16, y: y*16}, height: 4}));
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

const background = new Sprite({imageSrc: './Assets/background.png', position: {x: 0, y: 0}, size: {width: boardWidth, height: boardHeight}});

const player = new Player({
    position:{x: boardWidth/8, y: boardHeight/2.5},
    collisionBlocks,
    platformBlocks,
    imageSrc: './Assets/warrior/Idle.png',
    frameSize: 8,
    animations:{
        idle: {
            imageSrc: './Assets/warrior/Idle.png',
            frameSize: 8,
            frameBuffer: 10,
            reverse: false,
        },
        run: {
            imageSrc: './Assets/warrior/Run.png',
            frameSize: 8,
            frameBuffer: 12,
            reverse: false,
        },
        jump: {
            imageSrc: './Assets/warrior/Jump.png',
            frameSize: 2,
            frameBuffer: 8,
            reverse: false,
        },
        fall:{
            imageSrc: './Assets/warrior/Fall.png',
            frameSize: 2,
            frameBuffer: 8,
            reverse: false,
        },
        idleLeft:{
            imageSrc: './Assets/warrior/IdleLeft.png',
            frameSize: 8,
            frameBuffer: 10,
            reverse: true,
        },
        runLeft:{
            imageSrc: './Assets/warrior/RunLeft.png',
            frameSize: 8,
            frameBuffer: 12,
            reverse: true,
        },
        jumpLeft:{
            imageSrc: './Assets/warrior/JumpLeft.png',
            frameSize: 2,
            frameBuffer: 8,
            reverse: true,
        },
        fallLeft:{
            imageSrc: './Assets/warrior/FallLeft.png',
            frameSize: 2,
            frameBuffer: 8,
            reverse: true,
        }
    }
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
    if(gamePaused) return;
    deltaTime = getDeltaTime(timestamp);

    context.clearRect(0, 0, board.width, board.height);

    //making collision blocks
    context.save();
    context.scale(4, 4);
    context.translate(0, -background.image.height + board.height/4)
    background.render();
    context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    collisionBlocks.forEach((collisionBlock)=>{
        collisionBlock.render();
    });
    context.fillStyle = 'rgba(155, 155, 0, 0.5)';
    platformBlocks.forEach((collisionBlock)=>{
        collisionBlock.render();
    });

    //player movement
    player.move();

    player.velocity.x = 0;
    if(key.d.pressed){
        player.switchSprite('run');
        player.velocity.x = 400/4;
        player.lastDirection = 'right';
    }
    else if(key.a.pressed){
        player.switchSprite('runLeft');
        player.velocity.x = -400/4;
        player.lastDirection = 'left';
    }
    else if( player.velocity.y === 0){
        if(player.lastDirection === 'right'){
            player.switchSprite('idle');
        }
        else{
            player.switchSprite('idleLeft');
        }
    }

    if(player.velocity.y < 0){
        if(player.lastDirection === 'right'){
            player.switchSprite('jump');
        }
        else{
            player.switchSprite('jumpLeft');
        }
    }
    else if(player.velocity.y > 0){
        if(player.lastDirection === 'right'){
            player.switchSprite('fall');
        }
        else{
            player.switchSprite('fallLeft');
        }
    }
    context.restore();

    requestAnimationFrame(update);
}

//when the key is pressed
window.addEventListener("keydown", (e)=> {
    if(gamePaused) return;
    if((e.key === 'ArrowUp' || e.key === 'w') && player.velocity.y === 0){
        player.velocity.y = -350;
        player.updateLastPosition();
    }
    if(e.key === 'ArrowRight' || e.key === 'd'){
        key.d.pressed = true;
        player.updateLastPosition();
    }
    if(e.key === 'ArrowLeft' || e.key === 'a'){
        key.a.pressed = true;
        player.updateLastPosition();
    }
});

//when the key is released
window.addEventListener("keyup", (e)=> {
    if(e.key === 'ArrowRight' || e.key === 'd'){
        key.d.pressed = false;
        player.updateLastPosition();
    }
    if(e.key === 'ArrowLeft' || e.key === 'a'){
        key.a.pressed = false;
        player.updateLastPosition();
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

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "p") {
        gamePaused = !gamePaused;
        userPaused = gamePaused;
        requestAnimationFrame(update);
    }
    if(e.key === "r"){
        player.respawn();
        console.log('respawned');
    }
});