import { canvas } from '../index.js';
import {ctx} from '../index.js';

const tileW = 16*4;
const tileH = 16*4;
export class Player {
    constructor ({name, isPlayer, prefix, gender, currentMap}) {
        this.name = name;
        this.party = [];
        this.currency = 0;
        this.inventory = [];
        this.isPlayer = isPlayer;
        this.prefix = prefix;
        this.gender = gender;
        this.currentMap = currentMap;
        
        this.sprites = this.genSprites();
        this.currentSprite = this.sprites.walk.down,

        this.steps = 0;


        // Movement props
        this.moveFrame = 1;
        this.direction = 'down';
        this.isRunning = false;


        this.tileFrom = {x: this.currentMap.spawnTile.x, y: this.currentMap.spawnTile.y}
        this.tileTo = {x: this.currentMap.spawnTile.x, y: this.currentMap.spawnTile.y}
        
        this.timeMoved = 0;
        this.dimensions = {x: tileW, y: tileH};   // pixels
        this.position = {x: this.currentMap.spawnTile.x * tileW, y: this.currentMap.spawnTile.y * tileH}       // pixels
        this.delayMove = 300;                   // ms

    }


    showPos = function () {
        console.log(`Position\nx: ${this.position.x} y: ${this.position.y}\ntileFrom\nx: ${this.tileFrom.x} y: ${this.tileFrom.y}
        \ntileTo\nx: ${this.tileTo.x} y: ${this.tileTo.y}`);
    }

    placeAt = function (x, y) {
        // Places character at the specified tile

        this.tileFrom.x = x;
        this.tileFrom.y = y;

        this.tileTo.x = x;
        this.tileTo.y = y;

        // Position in pixels relative to top left of canvas
        // this.position.x = tileW*x + (tileW - this.dimensions.x)/2
        // this.position.y = tileH*y + (tileH - this.dimensions.y)/2
        this.position.x = tileW*x
        this.position.y = tileH*y
    }

    processMovement = function (t) {
        // t - time elapsed currently in game
        // Will return true if character is moving, else return false

        if (this.tileFrom.x === this.tileTo.x && this.tileFrom.y === this.tileTo.y) {
            this.currentSprite = this.sprites.walk[this.direction];
            return false;
        }

        if (this.isRunning) {
            this.delayMove = 100;
        } else {
            this.delayMove = 200;
        }

        let walkOrRun = this.isRunning ? 'run' : 'walk';
        this.currentSprite = this.sprites[walkOrRun][this.direction];

        if ((t - this.timeMoved) / this.delayMove < 0.5) {
            if (this.steps % 2 === 0) {
                this.moveFrame = 0;
            } else {
                this.moveFrame = 2;
            }
        } else {
            this.moveFrame = 1;
        }

        // Check if time elapsed is less than time to move
        if (t - this.timeMoved >= this.delayMove) {
            this.placeAt(this.tileTo.x, this.tileTo.y);
        } else {
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

    // isMoving = function () {

    // }

    genSprites = function() {
        const sprites = {};
        
        // Walk
        sprites.walk = {};
        sprites.walk.left = new Image();
        sprites.walk.left.src = `./img/sprites/player/${this.gender}/walk-left.png`
        sprites.walk.up = new Image();
        sprites.walk.up.src = `./img/sprites/player/${this.gender}/walk-up.png`
        sprites.walk.down = new Image();
        sprites.walk.down.src = `./img/sprites/player/${this.gender}/walk-down.png`
        sprites.walk.right = new Image();
        sprites.walk.right.src = `./img/sprites/player/${this.gender}/walk-right.png`
        

        // Run
        sprites.run = {};
        sprites.run.left = new Image();
        sprites.run.left.src = `./img/sprites/player/${this.gender}/run-left.png`
        sprites.run.up = new Image();
        sprites.run.up.src = `./img/sprites/player/${this.gender}/run-up.png`
        sprites.run.down = new Image();
        sprites.run.down.src = `./img/sprites/player/${this.gender}/run-down.png`
        sprites.run.right = new Image();
        sprites.run.right.src = `./img/sprites/player/${this.gender}/run-right.png`

        return sprites;
    }

    draw() {
        let scaleWidth = this.currentSprite.width / 3;
        // console.log('Player position {x: ' + this.position.x + ' y: ' + this.position.y)
        ctx.drawImage(
            this.currentSprite,
    
            scaleWidth * this.moveFrame,
            0,
    
            scaleWidth,
            this.currentSprite.height,
    
            // canvas.width / 2 - this.currentSprite.width / 3  + scaleWidth / 2, 
            // canvas.height / 2 - this.currentSprite.height / 2 - 16,

            this.position.x,
            this.position.y - this.currentSprite.height / 2,
    
            scaleWidth,
            this.currentSprite.height
        );
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

        if (availableMon === []) {
            return null;
        }

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