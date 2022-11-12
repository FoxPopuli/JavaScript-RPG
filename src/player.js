import {ctx} from '../index.js';
import { roll } from './useful-functions.js';
import { Textbox } from './textbox.js';
import {malePlayer} from './sprites.js';
// import pokeData from './pokemonData.json' assert {type: 'json'};

const tileW = 16*4;
const tileH = 16*4;
class Character {
    constructor ({name, prefix, currentMap}) {
        this.name = name;
        this.prefix = prefix;
        this.currentMap = currentMap;

        // Sprites
        this.sprites = malePlayer;
        this.currentSprite = this.sprites.walk.down;




        // Movement props
        this.steps = 0;
        this.moveFrame = 1;
        this.direction = 'down';
        this.moveType = 'walk';

        this.tileFrom = {x: this.currentMap.spawnTile.x, y: this.currentMap.spawnTile.y}
        this.tileTo = {x: this.currentMap.spawnTile.x, y: this.currentMap.spawnTile.y}
        
        this.timeMoved = 0;
        this.dimensions = {x: tileW, y: tileH};   // pixels
        this.position = {
            // in pixels
            x: this.currentMap.spawnTile.x * tileW, 
            y: this.currentMap.spawnTile.y * tileH
        }; 

        this.delayMove = 300;                   // ms


        // Other props
        this.updateTileFacing();


    }

    placeAt = function (x, y) {
        // Places character at the specified tile
        
        this.tileFrom.x = x;
        this.tileFrom.y = y;

        this.tileTo.x = x;
        this.tileTo.y = y;

        // Position in pixels relative to top left of canvas
        this.position.x = tileW*x
        this.position.y = tileH*y

    }


    processMovement = function (t) {
        // t - time elapsed currently in game
        // Will return true if character is moving, else return false


        if (this.tileFrom.x === this.tileTo.x && this.tileFrom.y === this.tileTo.y) {
            return false;
        }

        this.currentSprite = this.sprites[this.moveType][this.direction];

        switch (this.moveType) {
            case 'run':
                this.delayMove = 100;

                if ((t - this.timeMoved) / this.delayMove < 0.5) {
                    if (this.steps % 2 === 0) {
                        this.moveFrame = 0;
                    } else {
                        this.moveFrame = 2;
                    }
                } else {
                    this.moveFrame = 1;
                }
                break;
            case 'walk':
                this.delayMove = 200;

                if ((t - this.timeMoved) / this.delayMove < 0.5) {
                    if (this.steps % 2 === 0) {
                        this.moveFrame = 0;
                    } else {
                        this.moveFrame = 2;
                    }
                } else {
                    this.moveFrame = 1;
                }
                break;

            case 'surf':
                this.delayMove = 100;

                break;

        }



        // Check if time elapsed is less than time to move (arrived or travelling)
        if (t - this.timeMoved >= this.delayMove) {
            // Arrived
            this.placeAt(this.tileTo.x, this.tileTo.y);

        } else {
            // Travelling

            // Calculate current pixel position of character
            this.position.x = this.tileFrom.x * tileW + (tileW - this.dimensions.x) / 2;
            this.position.y = this.tileFrom.y * tileH + (tileH - this.dimensions.y) / 2;

            // Distance moved between current and destination x values 
            let diff = (tileW / this.delayMove) * (t - this.timeMoved);

            if (this.tileTo.x !== this.tileFrom.x) {
                // Move left or right by diff
                this.position.x += (this.tileTo.x < this.tileFrom.x ? 0 - diff : diff);
            }

            if (this.tileTo.y !== this.tileFrom.y) {
                // Move up or down by diff
                this.position.y += (this.tileTo.y < this.tileFrom.y ? 0 - diff : diff);
            }


            // round
            this.position.x = Math.round(this.position.x);
            this.position.y = Math.round(this.position.y);

            
        }
        return true;
    }

    move = function (currentKey) {
            
        let nextTile = {
            x: this.tileFrom.x,
            y: this.tileFrom.y
        }

        switch (currentKey) {
            case 'up':
            case 'w':
                nextTile.y -= 1;
                this.direction = 'up';
                break;
            case 'down':
            case 's':
                nextTile.y += 1;
                this.direction = 'down';
                break;
            case 'left':
            case 'a':
                nextTile.x -= 1;
                this.direction = 'left';
                break;
            case 'right':
            case 'd':
                nextTile.x += 1;
                this.direction = 'right';
                break;
        }

        this.currentSprite = this.sprites[this.moveType][this.direction];

        // Reset to idle walk if player isn't moving or surfing
        if (!currentKey && this.moveType === 'run') {
            this.currentSprite = this.sprites.walk[this.direction]
        }

        this.updateTileFacing();

        // Movement gates
        if (this.currentMap.waterMat[nextTile.y][nextTile.x] !== 0 && this.moveType !== 'surf') return;
        if (this.currentMap.colMat[nextTile.y][nextTile.x] !== 0) return;




        this.tileTo = nextTile;
        this.steps++;
        this.updateTileFacing();

    }

    updateTileFacing = function () {
        this.tileFacing = {
            x: this.tileFrom.x,
            y: this.tileFrom.y
        }
        switch (this.direction) {
            case 'up': 
                this.tileFacing.y -= 1;
                break;
            case 'left':
                this.tileFacing.x -= 1;
                break;
            case 'down':
                this.tileFacing.y += 1;
                break;
            case 'right':
                this.tileFacing.x += 1;
                break;
        }
    }

    draw() {

        let scale;
        let offset = {x: 0, y: 0};
        switch (this.moveType) {
            case 'walk':
            case 'run':
                scale = 3;
                break;
            case 'surf':
                scale = 2;

                // pixels
                offset.x = 0 - 32;
                offset.y = 8;
                break;

        }

        let scaleWidth = this.currentSprite.width / scale;

        ctx.drawImage(
            this.currentSprite,
    
            scaleWidth * this.moveFrame,
            0,
    
            scaleWidth,
            this.currentSprite.height,
    

            this.position.x + this.currentMap.viewport.offset.x + offset.x,
            this.position.y - this.currentSprite.height / 2 + this.currentMap.viewport.offset.y + offset.y,

            scaleWidth,
            this.currentSprite.height
        );
    }
}


export class Player extends Character {
    constructor ({name, prefix, gender, currentMap}) {
        super({name, prefix, gender, currentMap});
        this.party = [];
        this.currency = 0;
        this.inventory = [];

    }


    placeAt = function (x, y) {
        // Places character at the specified tile
        
        this.tileFrom.x = x;
        this.tileFrom.y = y;

        this.tileTo.x = x;
        this.tileTo.y = y;

        // Position in pixels relative to top left of canvas
        this.position.x = tileW*x
        this.position.y = tileH*y


        // Surf check
        if (this.moveType === 'surf' && this.currentMap.waterMat[this.tileFrom.y][this.tileFrom.x] === 0) {
            this.moveType = 'walk';
        };

        // Grass check
        if (this.currentMap.grassMat[this.tileFrom.y][this.tileFrom.x] !== 0) {
            if (roll(100) <= this.currentMap.encounterRates.grass) {
                console.log(this.currentMap.genEncounter('grass'));
            }

        }


    } 






    addToParty = function (pokemon) {
        if (typeof pokemon === 'object') {
            this.party.push(pokemon);
        } else {
            console.log("Not a pokemon object");
        }
    }

    switchMon = function () {
        console.log('switchMon() called');
        let availableMon = this.party.filter(mon => mon.status !== 'Faint');

        if (availableMon === []) {return null;}

        let partyIndex;
        if (this.isPlayer) {
            // Try use Array.prototype.reduce here
            let selectionString = '';
            for (let monIndex in availableMon) {
                if (this.party[monIndex].currentHP) {
                    selectionString += `${monIndex}: ${this.party[monIndex].name}\n`;
                }

            }
            partyIndex = prompt(selectionString + 'Please make your selection (number): ');

        } else {
            partyIndex = Math.floor(Math.random()*availableMon.length);
        }

        console.log(`switching to ${availableMon[partyIndex].name}`);
        return availableMon[partyIndex];
    }


}