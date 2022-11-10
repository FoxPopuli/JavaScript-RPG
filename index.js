import {Map} from './src/map.js';
import {Player} from './src/player.js';
import {Pokemon} from './src/pokemon.js';
import {Textbox, Menu} from '/src/textbox.js';

// mapFiles
import clearingMapFile from './src/the-clearing-demo-mapfile.json' assert {type: 'json'};


export const canvas = document.querySelector('#game-screen');
export const ctx = canvas.getContext('2d');

// 16:9
canvas.height = 720;
canvas.width = (canvas.height/9)*16;


// Globals

// Tile dimensions
const tileW = 16*4;
const tileH = 16*4;

// FPS and animations
let currentSecond = 0;
let frameCount = 0;
let framesLastSecond = 0;
let lastFrameTime = 0;



// VIEWPORT

const viewport = {
    screen:     {x: canvas.width, y: canvas.height},
    startTile:  {x: 0, y: 0},
    endTile:    {x: 0, y: 0},
    offset:     {x: 0, y: 0},

    report:     function () {
        console.log('Report')
        console.log(this.startTile);
        console.log(this.endTile);
    },

    update:     function (px, py) {
        // px, py : pixel coords of the center of the viewport
        this.px = px;
        this.py = py;

        this.startPixel = {x: this.startTile.x*tileW, y: this.startTile.y * tileH};
        this.endPixel =   {x: this.endTile.x * tileW, y: this.endTile.y * tileH};

        this.offset.x = Math.floor((this.screen.x / 2) - px);
        this.offset.y = Math.floor((this.screen.y / 2) - py);

        let tile = {
            x: Math.floor(px/tileW),
            y: Math.floor(py/tileH) 
        }

        this.startTile.x = tile.x - 1 - Math.ceil((this.screen.x / 2) / tileW)
        this.startTile.y = tile.y - 1 - Math.ceil((this.screen.y / 2) / tileH)

        if (this.startTile.x < 0) {this.startTile.x = 0;}
        if (this.startTile.y < 0) {this.startTile.y = 0;}

        this.endTile.x = tile.x + 1 + Math.ceil((this.screen.x / 2) / tileW);
        this.endTile.y = tile.y + 1 + Math.ceil((this.screen.y / 2) / tileH);

        if (this.endTile.x >= currentMap.mapFile.width) {this.endTile.x = currentMap.mapFile.width - 1;}
        if (this.endTile.y >= currentMap.mapFile.height) {this.endTile.y = currentMap.mapFile.height - 1;}
    }
}

// MAP

const clearingEncounters = {
    grass: [
        {
            id: 'charmander',
            rate: 50
        },

        {
            id: 'squirtle',
            rate: 50
        },
    ],

    water: [
        {
            id: 'squirtle',
            rate: 100
        }
    ]

}

const clearing = new Map({
    position: {x: 0, y: 0},
    imgPath: './img/maps/the-clearing-demo-grid.png',
    mapFile: clearingMapFile,
    viewport: viewport,
    encounterObj: clearingEncounters
})

clearing.encounters.grassRate = 5;
clearing.encounters.waterRate = 1;


const testMon = new Pokemon ({
    id:         'charmander', 
    level:      5, 
    moves:      ['tackle', 'growl', 'megaBeam', 'hypnosis'], 
    isPlayer:   true
})

const testMon2 = new Pokemon ({
    id:         'squirtle',
    level:      5,
    moves:      ['tackle', 'growl', 'megaBeam', 'hypnosis'], 
    isPlayer:   true
})

const player = new Player ({
    name:       'Vox',
    isPlayer:   true,
    prefix:     'Pokemon God ',
    gender:     'male',
    currentMap:  clearing
})

player.party.push(testMon)
player.party.push(testMon2)

// OVERWORLD CONTROLS

// Keybinds
const binds = {

    

    movement: {
        up: 'w',
        left: 'a',
        down: 's',
        right: 'd'
    },

    actions: {
        interact: 'e'
    }
} 

// Experimental movement controls
// Allows the current key to override the previous key if it's still being pressed, 
// and reinstated if it's still being pressed when the current key is lifted off.


// Pushes the key to the array if the last element in the array isn't already that key
Array.prototype.pushOnce = function(key) {
    if (this[this.length - 1] !== key) this.push(key);
}


//////////////////////////////
// test script

class TestScript {
    constructor () {
        this.tracker = 0;
        this.choice = null;
        this.box = null;
        this.sequence2 = new Menu(['Yes', 'No'])
    }

    run = function () {
        switch (this.tracker) {
            case 0:
                this.box = new Textbox(`This is the first text.`);
                break;
            case 1:
                this.box = new Textbox ('This is the second text'); 
                break;
            case 2:
                this.box = this.sequence2;
                // console.log(this.box);
                break;
            case 3:
                console.log(this.box.choice)
                switch (this.box.choice) {
                    case 'Yes':
                        this.box = new Textbox('You chose yes');
                        break;
                    case 'No':
                        this.box = new Textbox('You chose no');
                        break
                }
                break;
            default:
                // this.box = null;
                currentObj = null;
                break;
        }

        // console.log(this.box.choiceIndex)

        if (this.box) {
            this.box.draw();
        }
    }
}

const test1 = new Menu()

// console.log(test1)

////////////////////////////////



let moveArr = [];
let navArr = [];
let currentObj= null;
window.addEventListener('keydown', (e) => {
    if (!currentObj) {
        
        if (Object.values(binds.movement).includes(e.key)) {
            moveArr.pushOnce(e.key);
        }

        switch (e.key) {
            case 'e':
                let tile = player.tileFacing;
                currentObj = currentMap.objMat[tile.y][tile.x]
                break;
            case 'Shift':
                // This is bollocks
                if (player.moveType !== 'surf' || player.moveType !== 'cycle') {
                    player.moveType = player.moveType === 'run' ? 'walk' : 'run';
                }
                break;

                // For testing
            case 't': {
                currentObj = new TestScript()
            }
        }

    } else {
        switch (e.key) {
            case 'e':
                console.log(currentObj.tracker)
                if (currentObj.box.isMenu) {

                    currentObj.box.choice = currentObj.box.choices[currentObj.box.choiceIndex];
                    console.log(currentObj.box.choice)
                }
                currentObj.tracker += 1;
                break;
            case 'w':
                currentObj.box.choiceIndex += 1;
                console.log(currentObj.box.choiceIndex)
            case 's':
                currentObj.box.choiceIndex -= 1;
                console.log(currentObj.box.choiceIndex)

            }
    
    }

    switch (e.key) {
        // case 'e':
            

        //     currentTextbox = new Textbox(1, "Hello, World!");
        //     currentTextbox.draw();
        //     player.canMove = false;
        //     break;

        case 'q':
            currentObj = null;
            player.canMove = true;
            break;
    }

})




window.addEventListener( 'keyup', (e) => {

    if (currentObj) {
        moveArr = [];

    } else if (Object.values(binds.movement).includes(e.key)) {
        moveArr.splice(moveArr.indexOf(e.key), 1);
    }

    
})





// Initialization
let currentMap = player.currentMap;
player.placeAt(currentMap.spawnTile.x, currentMap.spawnTile.y)

let testMenu = new Menu(['Yes', 'No'])

function animate() {

    let currentFrameTime = Date.now();
    let timeElapsed = currentFrameTime - lastFrameTime;

    // Framerate
    let sec = Math.floor(Date.now() / 1000);
    if (sec !== currentSecond) {
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    } else {
        frameCount++;
    }

    // Movement
    let currentKey = moveArr[moveArr.length - 1];

    // Use something similar to this for menus
    if (!player.processMovement(currentFrameTime)) {
        player.move(currentKey);
        if (player.tileFrom.x !== player.tileTo.x || player.tileFrom.y !== player.tileTo.y) {
            player.timeMoved = currentFrameTime;
        }
        
    } 

    viewport.update( 
        player.position.x + (player.dimensions.x / 2),
        player.position.y + (player.dimensions.y / 2)
    );

    currentMap.draw();
    player.draw();
    currentMap.drawFG();

    // if (currentObj) {
    //     currentObj.textbox.draw()
    //     player.canMove = false;

    //     if (currentObj.choices) {
    //         let currentChoice = 0;
    //         switch (navArr[0]) {
    //             case 'w':
    //                 currentChoice += 1;
    //                 break;
    //             case 's':
    //                 currentChoice -= 1;
    //                 break;
    //         }

    //         navArr.pop();

    //         if (currentChoice < 0) {
    //             currentChoice = currentObj.choices.length - 1;
    //         } else if (currentChoice > currentObj.choices.length - 1) {
    //             currentChoice = 0;
    //         }
    //     }

    // }

    if (currentObj) {

        currentObj.run()

    }

    // console.log(player.tileFacing)


    lastFrameTime = currentFrameTime;
    requestAnimationFrame(animate);
}

animate()
