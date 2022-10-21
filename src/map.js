export class Map {
    constructor({ position, imgPath }) {
        this.position = position;
        this.imgPath = imgPath;
        this.img = new Image();

        this.img.src = imgPath
    };

    draw () {
        this.img.onload(() => {
            ctx.drawImage(this.img, this.position.x, this.position.y);
        })
        
    }


}