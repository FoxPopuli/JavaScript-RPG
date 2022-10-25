import {ctx} from '../index.js';

export class Map {
    constructor({ position, imgPath, layers}) {
        this.position = position;
        this.imgPath = imgPath;
        this.img = new Image();
        this.img.src = imgPath;
        this.layers = layers;
    }

    draw () {
        ctx.drawImage(this.img, this.position.x, this.position.y);
    }

}