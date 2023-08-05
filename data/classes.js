//sprite class
class Sprite{
    constructor({imageSrc, position, frameSize=1, frameBuffer=10, scale=1}){
        this.scale=scale;
        this.image = new Image();
        this.image.src = imageSrc;
        this.position = position;
        this.image.onload = ()=>{
            this.width = (this.image.width/this.frameSize) * this.scale;
            this.height = this.image.height * this.scale;
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
            this.currentFrame++;
            if(this.currentFrame >= this.frameSize){
                this.currentFrame = 0;
            }
        }
    }
}


//player class
class Player extends Sprite{
    constructor({position, collisionBlocks, imageSrc, frameSize, scale=0.6}) {
        super({imageSrc: imageSrc, position: position, frameSize: frameSize, scale: scale});
        this.position = position;
        this.velocity ={
            x:0,
            y:100/4
        };
    
        this.collisionBlocks = collisionBlocks;
        this.hitbox={
            position:{
                x: this.position.x + this.width/2 - 5,
                y: this.position.y + this.height/2 -1,
            },
            width:14,
            height:31,
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
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.y += gravity;
        this.updateHitbox();
        this.checkVertCollision();
    }

    updateHitbox(){
        this.hitbox={
            position:{
                x: this.position.x + this.width/2 - 5,
                y: this.position.y + this.height/2 -1,
            },
            width:14,
            height:31,
        }
    }

    checkHorzCollision(){
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
    }

    checkVertCollision(){
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
    }
}

//collision block class
class CollisionBlock{
    constructor({position}){
        this.position = position;
        this.width = 16;
        this.height = 16;
    }

    draw(){
        context.fillStyle = 'rgba(255, 0, 0, 0.5)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    render(){
        this.draw();
    }
}