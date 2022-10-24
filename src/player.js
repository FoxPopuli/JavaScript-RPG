import {ctx} from '../index.js';
export class Player {
    constructor ({name, isPlayer, prefix, gender}) {
        this.name = name;
        this.party = [];
        this.currency = 0;
        this.inventory = [];
        this.isPlayer = isPlayer;
        this.prefix = prefix;
        this.gender = gender;
        
        this.position = {
            x: 0,
            y: 0
        }
        this.sprites = this.genSprites();
        this.currentSprite = this.sprites.walk.down;
        

        this.direction = 'down';
        this.isRunning = false;

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
        





        return sprites;
    }


    // move = function(dir) {
    //     switch (dir) {
    //         case 'down':

    //     }
    // }

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