//sprite class
class Sprite{
    constructor({imageSrc, position, frameSize=1, frameBuffer=10, scale=1, reverse=false}){
        this.scale=scale;
        this.loaded = false;
        this.image = new Image();
        this.image.src = imageSrc;
        this.position = position;
        this.reverse = reverse;
        this.image.onload = ()=>{
            this.width = (this.image.width/this.frameSize) * this.scale;
            this.height = this.image.height * this.scale;
            this.loaded = true;
        }
        this.frameSize = frameSize;
        this.currentFrame = 0;
        this.frameBuffer = frameBuffer;
        this.elapsedFrames = 0 ;
    }

    draw(){
        if(!this.image){
            return;
        }
        const cropBox = {
            position:{
                x: this.currentFrame * (this.image.width/this.frameSize),
                y: 0,
            },
            width: this.image.width/this.frameSize,
            height: this.image.height,
        }

        context.drawImage(this.image, cropBox.position.x, cropBox.position.y, cropBox.width, cropBox.height, this.position.x, this.position.y, this.width, this.height);
    }

    render(){
        this.draw();
        this.renderFrames();
    }

    renderFrames(){
        this.elapsedFrames++;
        if(this.elapsedFrames % this.frameBuffer === 0){
            if(this.reverse) {
                // traverse frames in reverse order
                this.currentFrame--;
                if(this.currentFrame < 0){
                    this.currentFrame = this.frameSize - 1;
                }
            } else {
                // traverse frames in forward order
                this.currentFrame++;
                if(this.currentFrame >= this.frameSize){
                    this.currentFrame = 0;
                }
            }
            
        }
    }
}


//player class
class Player extends Sprite{
    constructor({position, collisionBlocks, platformBlocks, imageSrc, frameSize, scale=0.6, animations}) {
        super({imageSrc: imageSrc, position: position, frameSize: frameSize, scale: scale, reverse: false});
        this.position = position;
        this.velocity ={
            x:0,
            y:100/4
        };
    
        this.collisionBlocks = collisionBlocks;
        this.platformBlocks = platformBlocks;
        this.hitbox={
            position:{
                x: this.position.x + this.width/2 - 7,
                y: this.position.y + this.height/2 -1,
            },
            width:20,
            height:31,
        }

        this.lastDirection='right';
        this.lastPosition = this.position;

        this.animations = animations;
        for(let key in this.animations){
            const image = new Image();
            image.src = this.animations[key].imageSrc;
            this.animations[key].image = image;
        }

        this.cameraBox = {
            position: {
                x: this.position.x - this.width/2,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }
    }

    move() {
        this.renderFrames();
        this.updateHitbox();
        // //drawing image
        // context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        // context.fillRect(this.position.x, this.position.y, this.width, this.height);

        // //drawing hitbox
        // context.fillStyle = 'rgba(0, 255, 0, 0.5)';
        // context.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

        // //drawing camera box
        // context.fillStyle = 'rgba(0, 0, 255, 0.5)';
        // context.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);

        this.draw();

        //moving
        this.position.x += this.velocity.x * deltaTime;
        this.updateHitbox();
        this.checkHorzCollision();
        this.velocity.y += gravity;
        this.position.y += this.velocity.y * deltaTime;
        this.updateHitbox();
        this.updateCameraBox();
        this.checkVertCollision();
    }

    updateLastPosition(){
        this.lastPosition = {...this.position};
    }

    respawn() {
        this.position = {...this.lastPosition};
        this.position.y -= 10;
    }

    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) return;
        this.image = this.animations[key].image;
        this.frameBuffer = this.animations[key].frameBuffer;
        this.frameSize = this.animations[key].frameSize;
        this.reverse = this.animations[key].reverse;
        this.currentFrame = 0;
    }

    updateHitbox(){
        this.hitbox={
            position:{
                x: this.position.x + this.width/2 - 9,
                y: this.position.y + this.height/2 -1,
            },
            width:18,
            height:31,
        }
    }

    updateCameraBox(){
        this.cameraBox = {
            position: {
                x: this.position.x + this.width/2 - this.cameraBox.width/2,
                y: this.position.y ,
            },
            width: board.width/6,
            height: 95,
        }
    }

    checkHorzCanvasCollision(){
        if(this.hitbox.position.x + this.hitbox.width + this.velocity.x * deltaTime > 576
        || this.hitbox.position.x + this.velocity.x * deltaTime < 0){
            this.velocity.x = 0;
        }
    }

    panCameraLeft({board, camera}){
        const cameraBoxRight = this.cameraBox.position.x + this.cameraBox.width;

        if(cameraBoxRight > 576)return;

        if(cameraBoxRight > board.width/4 + Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x * deltaTime;
        }
    }

    panCameraRight({camera}){
        const cameraBoxLeft = this.cameraBox.position.x;

        if(cameraBoxLeft < 0)return;

        if(cameraBoxLeft< Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x * deltaTime;
        }
    }

    panCameraDown({camera}){
        const cameraBoxUp = this.cameraBox.position.y;

        if(cameraBoxUp + this.velocity.y*deltaTime < 0)return;

        if(cameraBoxUp < Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y * deltaTime;
        }
    }

    panCameraUp({board, camera}){
        const cameraBoxDown = this.cameraBox.position.y + this.cameraBox.height;

        if(cameraBoxDown + this.velocity.y*deltaTime > 432) return;

        if(cameraBoxDown > Math.abs(camera.position.y) + board.height/4){
            camera.position.y -= this.velocity.y * deltaTime;
        }
    }

    checkHorzCollision(){
        //floor collision
        for(let i=0; i< this.collisionBlocks.length; i++){
            const block = this.collisionBlocks[i];

            if(collisionDetection({object1: this.hitbox, object2: block})){
                if(this.velocity.x * deltaTime > 0){
                    this.velocity.x = 0;
                    const offset= this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = block.position.x - offset - 0.01;
                    break;
                }
                if(this.velocity.x * deltaTime < 0){
                    this.velocity.x = 0;
                    const offset= this.hitbox.position.x - this.position.x;
                    this.position.x = block.position.x + block.width -offset + 0.01;
                    break
                }
            }
        }

        //platform collision
        for(let i=0; i< this.platformBlocks.length; i++){
            const block2 = this.platformBlocks[i];

            if(collisionDetection({object1: this.hitbox, object2: block2})){
                if(this.velocity.x * deltaTime > 0){
                    this.velocity.x = 0;
                    const offset= this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = block2.position.x - offset - 0.01;
                    break;
                }
                if(this.velocity.x * deltaTime < 0){
                    this.velocity.x = 0;
                    const offset= this.hitbox.position.x - this.position.x;
                    this.position.x = block2.position.x + block2.width -offset + 0.01;
                    break
                }
            }
        }
    }

    checkVertCollision(){

        //floor collision
        for(let i=0; i< this.collisionBlocks.length; i++){
            const block = this.collisionBlocks[i];

            if(collisionDetection({object1: this.hitbox, object2: block})){
                if(this.velocity.y*deltaTime > 0){
                    this.velocity.y = 0;
                    const offset= this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = block.position.y - offset  - 0.01;
                    break;
                }
                if(this.velocity.y*deltaTime < 0){
                    this.velocity.y = 0;
                    const offset= this.hitbox.position.y - this.position.y;
                    this.position.y = block.position.y + block.height - offset + 0.01;
                    break;
                }
            }
        }

        // //platform collision
        // for(let i=0; i< this.platformBlocks.length; i++){
        //     const block2 = this.platformBlocks[i];

        //     if(collisionDetection2({object1: this.hitbox, object2: block2})){
        //         if(this.velocity.y*deltaTime > 0){
        //             this.velocity.y = 0;
        //             const offset= this.hitbox.position.y - this.position.y + this.hitbox.height;
        //             this.position.y = block2.position.y - offset  - 0.01;
        //             break;
        //         }
        //     }
        // }

        for(let i=0; i< this.platformBlocks.length; i++){
            const block = this.platformBlocks[i];

            if(collisionDetection({object1: this.hitbox, object2: block})){
                if(this.velocity.y*deltaTime > 0){
                    this.velocity.y = 0;
                    const offset= this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = block.position.y - offset  - 0.01;
                    break;
                }
                if(this.velocity.y*deltaTime < 0){
                    this.velocity.y = 0;
                    const offset= this.hitbox.position.y - this.position.y;
                    this.position.y = block.position.y + block.height - offset + 0.01;
                    break;
                }
            }
        }
    }
}

//collision block class
class CollisionBlock{
    constructor({position, height=16}){
        this.position = position;
        this.width = 16;
        this.height = height;
    }

    draw(){
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    render(){
        this.draw();
    }
}