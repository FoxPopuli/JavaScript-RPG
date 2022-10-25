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
        this.currentSprite = this.sprites.walk.down;
        

        this.direction = 'down';
        this.isRunning = false;


        // Movement props
        this.tileFrom = {x: 1, y: 1}
        this.tileTo = {x: 1, y: 1}
        this.timeMoved = 0;
        this.dimensions = {x: 16*4, y: 16*4};   // pixels
        this.position = {x: 4, y: 4};     // pixels
        this.delayMove = 100;               // ms

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
            return false;
        }

        // Check if time elapsed is less than time to move
        if (t - this.timeMoved >= this.delayMove) {
            this.placeAt(this.tileTo.x, this.tileTo.y);
        } else {
            // Calculate current pixel position of character
            this.position.x = this.tileFrom.x * tileW + (tileW - this.dimensions.x) / 2;
            this.position.y = this.tileFrom.y * tileH + (tileH - this.dimensions.y) / 2;

            let diff;
            if (this.tileTo.x !== this.tileFrom.x) {

                // Distance moved between current and destination x values 
                diff = (tileW / this.delayMove) * (t - this.timeMoved);

                // Move left or right by diff
                this.position.x += (this.tileTo.x < this.tileFrom.x ? 0 - diff : diff);
            }

            if (this.tileTo.y !== this.tileFrom.y) {

                // Distance moved between current and destination y values
                diff = (tileH / this.delayMove) * (t - this.timeMoved);

                // Move up or down by diff
                this.position.y += (this.tileTo.y < this.tileFrom.y ? 0 - diff : diff);
            }

            console.log('Diff: ' + diff);
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
        
        return sprites;
    }

    draw() {
        let scaleWidth = this.currentSprite.width / 3;
        // console.log('Player position {x: ' + this.position.x + ' y: ' + this.position.y)
        ctx.drawImage(
            this.currentSprite,
    
            scaleWidth,
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