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
    }

    move() {
        this.renderFrames();
        this.updateHitbox();
        //drawing image
        context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        //drawing hitbox
        context.fillStyle = 'rgba(0, 255, 0, 0.5)';
        context.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        this.draw();

        //moving
        this.position.x += this.velocity.x * deltaTime;
        this.updateHitbox();
        this.checkHorzCollision();
        this.velocity.y += gravity;
        this.position.y += this.velocity.y * deltaTime;
        this.updateHitbox();
        this.checkVertCollision();
    }

    updateLastPosition(){
        this.lastPosition = {...this.position};
    }

    respawn() {
        this.position = {...this.lastPosition};
        this.position.y -= 50;
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

        // //platform collision
        // for(let i=0; i< this.platformBlocks.length; i++){
        //     const block2 = this.platformBlocks[i];

        //     if(collisionDetection({object1: this.hitbox, object2: block2})){
        //         if(this.velocity.x * deltaTime > 0){
        //             this.velocity.x = 0;
        //             const offset= this.hitbox.position.x - this.position.x + this.hitbox.width;
        //             this.position.x = block2.position.x - offset - 0.01;
        //             break;
        //         }
        //         if(this.velocity.x * deltaTime < 0){
        //             this.velocity.x = 0;
        //             const offset= this.hitbox.position.x - this.position.x;
        //             this.position.x = block2.position.x + block2.width -offset + 0.01;
        //             break
        //         }
        //     }
        // }
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

        //platform collision
        for(let i=0; i< this.platformBlocks.length; i++){
            const block2 = this.platformBlocks[i];

            if(collisionDetection2({object1: this.hitbox, object2: block2})){
                if(this.velocity.y*deltaTime > 0){
                    this.velocity.y = 0;
                    const offset= this.hitbox.position.y - this.position.y + this.hitbox.height;
                    this.position.y = block2.position.y - offset  - 0.01;
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