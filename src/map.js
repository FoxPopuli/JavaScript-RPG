import {ctx} from '../index.js';

export class Map {
    constructor({ position, imgPath, mapFile, viewport}) {
        this.position = position;
        this.imgPath = imgPath;
        this.img = new Image();
        this.img.src = imgPath;
        this.mapFile = mapFile;
        this.viewport = viewport;

        this.spawnTile = {x: 15, y: 15};

        this.width = this.mapFile.width;
        this.height = this.mapFile.height;
        
        this.collisionArr = this.mapFile.layers.find(obj => {
            return obj.name === 'collision-tiles';
        })

        this.colMat = this.toMatrix(this.collisionArr.data)
    }

    draw () {
        
        ctx.drawImage(
            this.img,
            
            this.viewport.px - this.viewport.screen.x / 2,
            this.viewport.py - this.viewport.screen.y / 2,

            this.viewport.screen.x,
            this.viewport.screen.y,

            0,
            0,

            this.viewport.screen.x,
            this.viewport.screen.y
                    
        );

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

