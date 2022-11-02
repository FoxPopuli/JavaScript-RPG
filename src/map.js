import {ctx} from '../index.js';

export class Map {
    constructor({ position, imgPath, mapFile, viewport}) {
        this.position = position;
        this.imgPath = imgPath;
        this.img = new Image();
        this.img.src = imgPath;
        this.mapFile = mapFile;
        this.viewport = viewport;

        this.spawnTile = {x: 20, y: 30};

        this.width = this.mapFile.width;
        this.height = this.mapFile.height;
        
        this.collisionArr = this.mapFile.layers.find(obj => {
            return obj.name === 'collision-tiles';
        })

        this.colMat = this.toMatrix(this.collisionArr.data)
    }

    draw () {
        
        let dx = this.viewport.startTile.x * 16*4;
        let dy = this.viewport.startTile.y * 16*4
        let dWidth = this.viewport.screen.x;
        let dHeight = this.viewport.screen.y;
        // let sx = this.viewport.endTile.x * 16*4 + this.viewport.offset.x;
        // let sy = this.viewport.endTile.y * 16*4 + this.viewport.offset.y;
        let sx = this.viewport.endTile.x * 16*4;
        let sy = this.viewport.endTile.y * 16*4;
        let sWidth = dWidth;
        let sHeight = dHeight;

        console.log (`dx: ${dx}\ndy: ${dy}\ndWidth: ${dWidth}\ndHeight: ${dHeight}\nsx: ${sx}\nsy: ${sy}`)

        ctx.drawImage(
            this.img,
            
            // this.viewport.startTile.x * 16*4 + this.viewport.offset.x, 
            // this.viewport.startTile.y * 16*4 + this.viewport.offset.y,


            this.viewport.px - this.viewport.screen.x / 2,
            this.viewport.py - this.viewport.screen.y / 2,

            // this.viewport.startTile.x * 16*4, 
            // this.viewport.startTile.y * 16*4,


            this.viewport.screen.x,
            this.viewport.screen.y,


            // this.viewport.endTile.x * 16*4 + this.viewport.offset.x,
            // this.viewport.endTile.y * 16*4 + this.viewport.offset.y,
            0,
            0,


            this.viewport.screen.x,
            this.viewport.screen.y
                    
            );

        // ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height);
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

