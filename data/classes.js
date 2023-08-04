
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

    move(){
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

    move(){
        this.draw();
    }
}