import {ctx} from '../index.js';
import { Textbox, Menu } from './textbox.js';
import { roll } from './useful-functions.js';
import {Pokemon} from './pokemon.js';

class WaterTile {
    constructor () {
        this.textbox = new Textbox('Do you want to surf?');
        this.choices = ['Yes', 'No'];
    }

    onClick = function () {
        player.moveType = 'surf';
        player.move(player.direction);
    }

}

// const waterTileScript = {

// }



export class Map {
    constructor({mapData, mapFile, viewport}) {


        this.background = new Image();
        this.background.src = mapData.imgPathBG;

        this.foreground = new Image();
        this.foreground.src = mapData.imgPathFG;


        this.mapFile = mapFile;
        this.viewport = viewport;
        this.encounterObj = mapData.encounterObj;
        this.encounterRates = mapData.encounterRates;



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
        for (const [encType, encMons] of Object.entries(this.encounterObj)) {
            this.encounters[encType + 'Arr'] = [];
            console.log(encMons)
            encMons.forEach ( mon => {
                for (let i = 0; i < mon.rate; i++) {
                    this.encounters[encType + 'Arr'].push(mon.id);
                }
            })
        }



        // TEST

        const waterObjArr = waterArr.data.map (tile => {
            if (tile) {
                // console.log(tile)
                return new WaterTile();
            } else {
                return 0;
            }
        })

        this.objMat = this.toMatrix(waterObjArr);

    }




    genEncounter = function (type) {


        const encounterId = this.encounters[type + 'Arr'][roll(100)] 
        const encounter = this.encounterObj[type].find( element => element.id = encounterId)
        const encounterLvl = encounter.levelRange[roll(encounter.levelRange.length)]
        return new Pokemon ({
            id: encounterId, 
            level: encounterLvl, 
            moves: [], 
            isPlayer: false
        })

        
    }

    draw () {
        
        ctx.drawImage(
            this.background,
            
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

