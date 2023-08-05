
//player class
class Player {
    constructor({position, collisionBlocks}) {
        this.position = position;
        this.velocity ={
            x:0,
            y:100/4
        };
        this.height = 100/4;
        this.width = 100/4;

        this.collisionBlocks = collisionBlocks;
    }

    draw(){
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, this.width, this.width);
    }

    move() {
        this.draw();

        //moving
        this.position.x += this.velocity.x * deltaTime;
        this.checkHorzCollision();
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.y += gravity;
        this.checkVertCollision();

    }

    checkHorzCollision(){
        for(let i=0; i< this.collisionBlocks.length; i++){
            const block = this.collisionBlocks[i];

            if(collisionDetection({object1: this, object2: block})){
                if(this.velocity.x * deltaTime > 0){
                    this.velocity.x = 0;
                    this.position.x = block.position.x - this.width - 0.01;
                    break;
                }
                if(this.velocity.x * deltaTime < 0){
                    this.velocity.x = 0;
                    this.position.x = block.position.x + block.width + 0.01;
                    break
                }
            }
        }
    }

    checkVertCollision(){
        for(let i=0; i< this.collisionBlocks.length; i++){
            const block = this.collisionBlocks[i];

            if(collisionDetection({object1: this, object2: block})){
                if(this.velocity.y*deltaTime > 0){
                    this.velocity.y = 0;
                    this.position.y = block.position.y - this.height - 0.01;
                    break;
                }
                if(this.velocity.y*deltaTime < 0){
                    this.velocity.y = 0;
                    this.position.y = block.position.y + block.height + 0.01;
                    break;
                }
            }
        }
    }
}

//sprite class
class Sprite{
    constructor({imageSrc, position}){
        this.image = new Image();
        this.image.src = './Assets/'+imageSrc+'.png';
        this.position = position;
    }

    draw(){
        if(!this.image){
            return;
        }
        context.drawImage(this.image, this.position.x, this.position.y);
    }

    render(){
        this.draw();
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