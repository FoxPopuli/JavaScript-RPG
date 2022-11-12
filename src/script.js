import {Textbox, Menu} from './textbox.js';
import { player } from '../index.js';
//////////////////////////////
// test script

export class Script {
    constructor () {
        this.tracker = 0;
        this.choice = null;
        this.textbox = null;
        this.isActive = true;


        // this.sequence = sequence
        // this.menu = new Menu (['Yes', 'No']);
        
    }
}
class Test extends Script {
    run() {
        switch (this.tracker) {
            case 0:
                this.textbox = new Textbox(`This is the first text.`);
                break;
            case 1:
                this.textbox = new Textbox ('This is the second text'); 
                break;
            case 2:
                this.textbox = new Textbox ('Please make a choice');
                this.menuBox = this.menu;
                break;
            case 3:
    
                switch (this.menuBox.choice) {
                    case 'Yes':
                        this.textbox = new Textbox('You chose yes');
                        this.menuBox.canDraw = false;
                        break;
                    case 'No':
                        this.textbox = new Textbox('You chose no');
                        this.menuBox.canDraw = false;
                        break
                }
    
                break;
            default:
                currentObj = null;
                break;
        }
    
        if (this.textbox) {
            this.textbox.draw();
        }
    
        if (this.menuBox) {
            if (this.menuBox.canDraw) {
                this.menuBox.draw()
            }
        }
    
     
    }
}
const testScript = new Script()
testScript.run = function () {
    switch (this.tracker) {
        case 0:
            this.textbox = new Textbox(`This is the first text.`);
            break;
        case 1:
            this.textbox = new Textbox ('This is the second text'); 
            break;
        case 2:
            this.textbox = new Textbox ('Please make a choice');
            this.menuBox = this.menu;
            break;
        case 3:

            switch (this.menuBox.choice) {
                case 'Yes':
                    this.textbox = new Textbox('You chose yes');
                    this.menuBox.canDraw = false;
                    break;
                case 'No':
                    this.textbox = new Textbox('You chose no');
                    this.menuBox.canDraw = false;
                    break
            }

            break;
        default:
            currentObj = null;
            break;
    }

    if (this.textbox) {
        this.textbox.draw();
    }

    if (this.menuBox) {
        if (this.menuBox.canDraw) {
            this.menuBox.draw()
        }
    }

}


export class waterScript {
    constructor () {
        this.tracker = 0;
        this.choice = null;
        this.textbox = null;
        this.menu = new Menu (['Yes', 'No']);
        this.isActive = true;
    }

    run () {
        // if (!this.isActive) return;
        switch (this.tracker) {
            case 0:
                if (player.party.find(mon => mon.type.includes('Water'))) {
                    this.textbox = new Textbox( 'Would you like to surf?');
                    this.menuBox = this.menu;
            
                } else {
                    this.textbox = new Textbox ('You need a water type Pokemon to cross water.');
                }
                break;
            case 1:
                if (this.menuBox) {
                    switch (this.menuBox.choice) {
                        case 'Yes':
                            player.moveType = 'surf';
                            player.move(player.direction);
                            this.tracker++;
                            break;
                        case 'No':
                            this.tracker++;
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
    
        if (this.menuBox) {
            if (this.menuBox.canDraw) {
                this.menuBox.draw()
            }
        }
    }
};