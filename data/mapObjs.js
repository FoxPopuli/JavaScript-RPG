import { Character } from "../src/player.js";
import { CharacterScript } from "../src/script.js"
import { Textbox, Menu } from "../src/textbox.js";
import { allSprites } from "../src/sprites.js";
import { Pokemon } from "../src/pokemon.js";


const jimmyScript = new CharacterScript();
jimmyScript.run = function (thisObj, player) {
    this.runPrescript(thisObj, player);

    thisObj.updateTileFacing();
    if (!this.flag1) {
        switch (this.tracker) {
            case 0:
                this.textbox = new Textbox(`Hi! Did you know that you can cross bodies of water if you have a water type Pokemon?`);
                if (!this.menu) this.menu = new Menu (['Yes', 'No']);
                break;

            case 1:
                switch (this.choice) {
                    case 'Yes':
                        this.textbox = new Textbox("Ah, you're a smart one!");
                        this.menu = null;
                        break;
                    case 'No':
                        this.textbox = new Textbox('Well, now you do!');
                        this.menu = null;
                        break
                }
    
                break;
            default:
                this.isActive = false;
                break;
        }
    }


    if (this.textbox) {
        this.textbox.draw();
    }


    if (this.menu) {
        this.menu.draw();
    }
}

const jimmy = {
    name: 'Jimmy',
    prefix: 'My Man',
    currentMap: null,
    spawnTile: {
        x: 21,
        y: 15
    },
    script: jimmyScript,
    sprites: allSprites.schoolBoy
    
}

const johnnyScript = new CharacterScript ();
johnnyScript.run = function (thisObj, player) {
    this.runPrescript(thisObj, player);

    if (!this.flag1) {

        switch (this.tracker) {
            case 0:
                this.textbox = new Textbox('Yo! Want this water type?');
                if (!this.menu) this.menu = new Menu (['Yes', 'No']);
                break;
            case 1:
                switch (this.choice) {
                    case 'Yes':
                        this.textbox = new Textbox ('Here you go!');
                        if (!this.flag2) {
                            player.addToParty(new Pokemon({
                                id: 'squirtle',
                                level: 5,
                                moves: [],
                                isPlayer: true
                            }));
                        }
                        this.flag2 = true;
                        this.menu = null;
                        break;
                    case 'No':
                        this.textbox = new Textbox ('Alrighty then.');
                        this.menu = null;
                        break
                }

                break;
            default:
                if (this.flag2) this.flag1 = true;
                this.isActive = false;
                break;
        }
    } else {
        switch (this.tracker) {
            case 0:
                this.textbox = new Textbox ('Hope Squirtle is doing well!');
                break;
            default:
                this.isActive = false;
                break;
        }
    }

    if (this.textbox) {
        this.textbox.draw();
    }


    if (this.menu) {
        this.menu.draw();
    }
}

const johnny = {
    name: 'Johnny',
    prefix: 'My guy',
    spawnTile: {
        x: 23,
        y: 12
    },
    sprites: allSprites.malePlayer,
    script: johnnyScript
}

export const clearingMapObjs = [jimmy, johnny];