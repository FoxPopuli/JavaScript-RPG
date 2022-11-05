import { canvas } from '../index.js';
import {ctx} from '../index.js';
import { roll } from './useful-functions.js';
import {Pokemon} from './pokemon.js';
// import pokeData from './pokemonData.json' assert {type: 'json'};

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

        this.steps = 0;


        // Movement props
        this.moveFrame = 1;
        this.direction = 'down';
        this.moveType = 'walk';
        this.isRunning = false;


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
        this.isSurfing = false;
        this.updateTileFacing();


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
        this.position.x = tileW*x
        this.position.y = tileH*y


        // Surf check
        if (this.moveType === 'surf' && this.currentMap.waterMat[this.tileFrom.y][this.tileFrom.x] === 0) {
            console.log('Leaving water');
            this.moveType = 'walk';
        };

        // Grass check
        if (this.currentMap.grassMat[this.tileFrom.y][this.tileFrom.x] !== 0) {
            // console.log('In grass')
            if (roll(100) <= this.currentMap.encounters.grassRate) {
                console.log('battle!');

                const encounterId = this.currentMap.encounters.grassArr[roll(100)];

                console.log(new Pokemon({
                    id: encounterId,
                    level: 5,
                    moves: [],
                    isPlayer: false
                }))
            }

        }


    }


    processMovement = function (t) {
        // t - time elapsed currently in game
        // Will return true if character is moving, else return false


        if (this.tileFrom.x === this.tileTo.x && this.tileFrom.y === this.tileTo.y) {
            return false;
        }


        // Choose sprite
        switch (this.moveType) {
            case 'run':
                this.delayMove = 100;
                this.currentSprite = this.sprites[this.moveType][this.direction];
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
                this.currentSprite = this.sprites[this.moveType][this.direction];
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
                this.currentSprite = this.sprites[this.moveType][this.direction];
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

        // Surf
        sprites.surf = {};
        sprites.surf.left = new Image();
        sprites.surf.left.src = `./img/sprites/player/${this.gender}/surf-left.png`
        sprites.surf.up = new Image();
        sprites.surf.up.src = `./img/sprites/player/${this.gender}/surf-up.png`
        sprites.surf.down = new Image();
        sprites.surf.down.src = `./img/sprites/player/${this.gender}/surf-down.png`
        sprites.surf.right = new Image();
        sprites.surf.right.src = `./img/sprites/player/${this.gender}/surf-right.png`

        return sprites;
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
        // scale = this.moveType === 'surf' ? 2 : 3;
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

    interact() {
        if (this.currentMap.waterMat[this.tileFacing.y][this.tileFacing.x] !== 0 && !this.isSurfing) {
            const waterMon = this.party.filter( obj => obj.type.includes('Water') )

            if (waterMon.length > 0) {
                this.moveType = 'surf';
                this.move(this.direction);
            }

        }
    }

}