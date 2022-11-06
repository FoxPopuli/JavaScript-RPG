import {ctx} from '../index.js';
import { Textbox } from './textbox.js';

class WaterTile {
    constructor () {
        this.textbox = new Textbox(1, 'Do you want to surf?');
        this.choices = ['Yes', 'No'];
    }

    onClick = function () {
        player.moveType = 'surf';
        player.move(player.direction);
    }

}



export class Map {
    constructor({ position, imgPath, mapFile, viewport, encounterObj}) {
        this.position = position;
        this.imgPath = imgPath;
        this.img = new Image();
        this.img.src = imgPath;
        this.mapFile = mapFile;
        this.viewport = viewport;


        this.foreground = new Image();
        this.foreground.src = './img/maps/the-clearing-demo-foreground.png';

        this.spawnTile = {x: 15, y: 15};

        this.width = this.mapFile.width;
        this.height = this.mapFile.height;
        
        // Extract mapFile data
        const collisionArr = this.mapFile.layers.find(obj => {return obj.name === 'collision-tiles';})
        this.colMat = this.toMatrix(collisionArr.data);

        const waterArr = this.mapFile.layers.find(obj => {return obj.name === 'water';}) 
        this.waterMat = this.toMatrix(waterArr.data);

        const grassArr = this.mapFile.layers.find (obj => {return obj.name === 'battle-grass';})
        this.grassMat = this.toMatrix(grassArr.data);

        // Generate encounter array

        this.encounters = {}
        this.genEncArray(encounterObj);


        // TEST

        const waterObjArr = waterArr.data.map (tile => {
            if (tile) {
                // console.log(tile)
                return new WaterTile();
            } else {
                return 0;
            }
        })
        console.log(waterObjArr)
        this.objMat = this.toMatrix(waterObjArr);

    }



    genEncArray = function (encObj) {

        for (const [encType, encMons] of Object.entries(encObj)) {
            this.encounters[encType + 'Arr'] = [];
            encMons.forEach ( mon => {
                for (let i = 0; i < mon.rate; i++) {
                    this.encounters[encType + 'Arr'].push(mon.id);
                }
            })
        }
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

    drawFG () {
        ctx.drawImage(
            this.foreground,
            
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
        let mapWidth = this.width;
        let matrix = [];
        
        for (let i = 0; i < array.length; i += mapWidth) {
            matrix.push(array.slice(i, mapWidth + i));
        }

        return matrix;
    }

} 

