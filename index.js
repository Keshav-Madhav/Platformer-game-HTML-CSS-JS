let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

let deltaTime = 0;
let lastFrameTime = null;

let startTime=null;
let elapsedTime=0;

let gamePaused = false;

let score=0;

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

const gravity = 520;

const background = new Sprite({imageSrc: './Assets/background.png', position: {x: 0, y: 0}, size: {width: boardWidth, height: boardHeight}});
const bgHeight = 432;

const coin = new Sprite({
    imageSrc: './Assets/coin.png', 
    position: {x:110, y: 290},
    frameSize: 6, 
    frameBuffer: 10,
    scale: 0.12,
});

const coinSpawnLocations = [];

for (let i = 0; i < platformBlocks.length; i += 3) {
    const middlePlatformBlock = platformBlocks[i + 1];
    coinSpawnLocations.push({
        x: middlePlatformBlock.position.x,
        y: middlePlatformBlock.position.y -15,
    });
}

const player = new Player({
    position:{x: boardWidth/12, y: boardHeight/2.5},
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
    const coin = new Sprite({
        imageSrc: './Assets/coin.png', 
        position: {x:110, y: 290},
        frameSize: 6, 
        frameBuffer: 10,
        scale: 0.12,
    });

    requestAnimationFrame(update);
}

const camera={
    position: {
        x: 0,
        y: -bgHeight + boardHeight/4,
    },
}

//update the game
function update(timestamp) {
    if(gamePaused) return;
    deltaTime = getDeltaTime(timestamp);

    context.clearRect(0, 0, board.width, board.height);

    //making collision blocks
    context.save();
    context.scale(4, 4);
    context.translate(camera.position.x, camera.position.y);
    background.render();
    // context.fillStyle = 'rgba(255, 0, 0, 0.5)';
    // collisionBlocks.forEach((collisionBlock)=>{
    //     collisionBlock.render();
    // });
    // context.fillStyle = 'rgba(155, 155, 0, 0.5)';
    // platformBlocks.forEach((collisionBlock)=>{
    //     collisionBlock.render();
    // });

    //player movement
    player.checkHorzCanvasCollision();
    player.move();
    drawArrow();

    coin.render();
    if (collisionDetection({object1: player.hitbox, object2: coin})) {
        spawnCoin();
        score+=10;
        document.getElementById('score').innerHTML = "Score: "+score;
        console.log(score);
    }

    player.velocity.x = 0;
    if(key.d.pressed){
        player.switchSprite('run');
        player.velocity.x = 400/4;
        player.lastDirection = 'right';
        player.panCameraLeft({board, camera});
    }
    else if(key.a.pressed){
        player.switchSprite('runLeft');
        player.velocity.x = -400/4;
        player.lastDirection = 'left';
        player.panCameraRight({camera});
    }
    else if( player.velocity.y === 0){ 
        player.updateLastPosition();
        if(player.lastDirection === 'right'){
            player.switchSprite('idle');
        }
        else{
            player.switchSprite('idleLeft');
        }
    }

    if(player.velocity.y < 0){
        player.panCameraDown({camera});
        if(player.lastDirection === 'right'){
            player.switchSprite('jump');
        }
        else{
            player.switchSprite('jumpLeft');
        }
    }
    else if(player.velocity.y > 0){
        player.panCameraUp({board, camera});
        if(player.lastDirection === 'right'){
            player.switchSprite('fall');
        }
        else{
            player.switchSprite('fallLeft');
        }
    }
    context.restore();

    if (score > 0 && !gamePaused) {
        if (startTime === null) {
            startTime = window.performance.now();
        } else {
            elapsedTime = window.performance.now() - startTime;
        }
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `Time: ${Math.floor(elapsedTime / 1000)}s`;
    }

    requestAnimationFrame(update);
}

function spawnCoin() {
    const randomIndex = Math.floor(Math.random() * coinSpawnLocations.length);
    coin.position.x = coinSpawnLocations[randomIndex].x;
    coin.position.y = coinSpawnLocations[randomIndex].y;
}

function drawArrow() {
    context.strokeStyle = 'rgba(155,155,155, 0.3)';
    // Calculate the angle between the player and the coin
    const angle = Math.atan2(coin.position.y - player.hitbox.position.y, coin.position.x - player.hitbox.position.x);

    // Set the distance between the player and the start of the arrow
    const gap = 10;

    // Set the position of the arrow near the player
    const arrowX = player.hitbox.position.x + gap * Math.cos(angle) + 12;
    const arrowY = player.hitbox.position.y + gap * Math.sin(angle) + 3;

    // Set the length of the arrow
    const arrowLength = 10;

    // Calculate the end position of the arrow
    const endX = arrowX + arrowLength * Math.cos(angle);
    const endY = arrowY + arrowLength * Math.sin(angle);

    // Draw the arrow
    context.beginPath();
    context.moveTo(arrowX, arrowY);
    context.lineTo(endX, endY);

    // Set the size of the arrowhead
    const headLength = 4;

    // Calculate the position of the first point of the arrowhead
    const headX1 = endX - headLength * Math.cos(angle - Math.PI / 6);
    const headY1 = endY - headLength * Math.sin(angle - Math.PI / 6);

    // Calculate the position of the second point of the arrowhead
    const headX2 = endX - headLength * Math.cos(angle + Math.PI / 6);
    const headY2 = endY - headLength * Math.sin(angle + Math.PI / 6);

    // Draw the first line of the arrowhead
    context.lineTo(headX1, headY1);

    // Move back to the end position of the arrow
    context.moveTo(endX, endY);

    // Draw the second line of the arrowhead
    context.lineTo(headX2, headY2);

    context.stroke();
}
//when the key is pressed
window.addEventListener("keydown", (e)=> {
    if(gamePaused) return;
    if((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && player.velocity.y === 0){
        player.velocity.y = -300;
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

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "p") {
        gamePaused = !gamePaused;
        if (!gamePaused) {
            startTime = window.performance.now() - elapsedTime;
        }
        player.respawn();
        requestAnimationFrame(update);
    }
    if(e.key === "r"){
        player.respawn();
        console.log('respawned');
    }
});