import {Textbox, Menu} from './textbox.js';
import { player } from '../index.js';
//////////////////////////////
// test script

export class Script {
    constructor () {
        this.tracker = 0;
        this.choice = null;
        this.textbox = null;
        this.menu = null;
        this.isActive = true;


        // this.sequence = sequence
        // this.menu = new Menu (['Yes', 'No']);
        
    }
}

function battle(a, b) {
    console.log(`${b.name} wants to battle!`);
    console.log(`${a.prefix} ${a.name} sent out ${a.party}`)
}

export class CharacterScript extends Script {
    run(thisObj, player) {

        switch (player.direction) {
            case 'up':
                thisObj.direction = 'down';
                break;
            case 'down':
                thisObj.direction = 'up';
                break;
            case 'left':
                thisObj.direction = 'right';
                console.log(thisObj.direction)

                break;
            case 'right':
                thisObj.direction = 'left';
                console.log(thisObj.direction)
                break;

        }

        thisObj.updateTileFacing();
        switch (this.tracker) {
            case 0:
                this.textbox = new Textbox(`This is the first text.`);
                break;
            case 1:
                this.textbox = new Textbox ('This is the second text'); 
                break;
            case 2:
                this.textbox = new Textbox ('Make a choice.');
                if (!this.menu) this.menu = new Menu (['Yes', 'No']);
                break;
            case 3:
    
                switch (this.choice) {
                    case 'Yes':
                        this.textbox = new Textbox('You chose yes.');
                        this.menu = null;
                        break;
                    case 'No':
                        this.textbox = new Textbox('You chose no.');
                        this.menu = null;
                        break
                }
    
                break;
            default:
                this.isActive = false;
                break;
        }
    
        if (this.textbox) {
            this.textbox.draw();
        }
    
        if (this.menu) {
            this.menu.draw();
        }
    
     
    }
}

export class DefaultScript extends Script {
    run (thisObj, player) {
        switch (this.tracker) {
            case 0:
                this.textbox = new Textbox('Example text.');
            default:
                this.isActive = false;
        }
    }
}

export class WaterScript extends Script {

    run (player) {
        // if (!this.isActive) return;
        switch (this.tracker) {
            case 0:
                if (player.party.find(mon => mon.type.includes('Water'))) {
                    this.textbox = new Textbox( 'Would you like to surf?');
                    if (!this.menu) this.menu = new Menu (['Yes', 'No']);

            
                } else {
                    this.textbox = new Textbox ('You need a water type Pokemon to cross water.');
                }
                break;
            case 1:
                if (this.menu) {
                    switch (this.choice) {
                        case 'Yes':
                            player.moveType = 'surf';
                            player.move(player.direction);
                            this.menu = null;
                            this.tracker++;

                            break;
                        case 'No':
                            this.menu = null;
                            this.tracker++
                            break;
                    }
                } else {
                    this.isActive = false;
                }
                break;
    
            default:
                this.isActive = false;
                break;
        }
    

        if (this.textbox) {
            this.textbox.draw();
        }
    
        if (this.menu) {
            this.menu.draw()
        }
    }
};


export class TestScriptNPC extends Script {
    run () {
        switch (this.tracker) {
            case 0:
                
                this.textbox = new Textbox ("Hi! We've never spoken...");
        }
    }
}