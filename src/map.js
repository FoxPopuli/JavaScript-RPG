import {ctx} from '../index.js';

export class Map {
    constructor({ position, imgPath, mapFile}) {
        this.position = position;
        this.imgPath = imgPath;
        this.img = new Image();
        this.img.src = imgPath;
        this.mapFile = mapFile;
        
        this.collisionArr = this.mapFile.layers.find(obj => {
            return obj.name === 'collision-tiles';
        })


        this.colMat = this.toMatrix(this.collisionArr.data)


    }

    draw () {
        ctx.drawImage(this.img, this.position.x, this.position.y);
    }

    toMatrix = function (array) {
        let mapWidth = this.mapFile.width;
        let matrix = [];
        
        for (let i = 0; i < array.length; i += mapWidth) {
            matrix.push(array.slice(i, mapWidth + i));
        }

        return matrix;
    }

}