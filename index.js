import {Map} from './src/map.js';
import {BasicMapObj, Trainer, Player, Character} from './src/player.js';
import {Pokemon} from './src/pokemon.js';
import {Textbox, Menu} from './src/textbox.js';
import {CharacterScript, Script, WaterScript} from './src/script.js';
import {allSprites} from './src/sprites.js';
import { clearingMapObjs } from './data/mapObjs.js';

// mapFiles
import clearingMapFile from './json/the-clearing-demo-mapfile.json' assert {type: 'json'};
// Map Data
import allMapData from './json/map-data.json' assert {type: 'json'};


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

const clearing = new Map({
    mapData: allMapData.theClearing,
    mapFile: clearingMapFile,
    viewport: viewport,
    mapObjData: clearingMapObjs
})




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

const testObj = new Character ({
    spawnTile: {x: 21, y: 15},
    sprites: allSprites.malePlayer,
    script: new CharacterScript (),
    currentMap: clearing
})


export const player = new Player ({
    name:           'Vox',
    prefix:         'Pokemon God ',
    currentMap:     clearing,
    spawnTile:      clearing.spawnTile,
    sprites:        allSprites.malePlayer
})  


player.party.push(testMon)
// player.party.push(testMon2)

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

let moveArr = [];
let currentObj = {};
currentObj.script = {};
currentObj.script.isActive = false;

window.addEventListener('keydown', (e) => {
    if (!currentObj.script.isActive) {
        
        // Overworld controls
        if (Object.values(binds.movement).includes(e.key)) {
            moveArr.pushOnce(e.key);
        }

        switch (e.key) {
            case 'e':
                console.log(player.tileFacing)
                
                let objFacing = currentMap.objMatrix[player.tileFacing.y][player.tileFacing.x];

                if (objFacing) {
                    currentObj = objFacing;
                    if (!currentObj.script.isActive) {
                        currentObj.script.reset()
                    };
                }

            

                if (currentMap.waterMat[player.tileFacing.y][player.tileFacing.x]) {
                    currentObj = new BasicMapObj ({
                        script: new WaterScript ()
                    });

                }
                break;
            case 'Shift':
                if (player.moveType !== 'surf' || player.moveType !== 'cycle') {
                    player.moveType = player.moveType === 'run' ? 'walk' : 'run';
                }
                break;
               
            case 't': {
                // For testing
                console.log(player.party)
            }
        }

    } else {
        // Menu controls
        switch (e.key) {
            case 'e':
                if (currentObj.script.menu) {
                    currentObj.script.choice = currentObj.script.menu.choices[currentObj.script.menu.choiceIndex];
                }
                currentObj.script.tracker += 1;
                break;
            case 'w':
                currentObj.script.menu.choiceIndex -= 1;
                break;
            case 's':
                currentObj.script.menu.choiceIndex += 1;
                break;

            }
    
    }

    switch (e.key) {
        case 'q':
            currentObj.script.isActive = false;
            // currentObj = null;
            break;
    }

})




window.addEventListener( 'keyup', (e) => {

    if (currentObj.isActive) {
        moveArr = [];

    } else if (Object.values(binds.movement).includes(e.key)) {
        moveArr.splice(moveArr.indexOf(e.key), 1);
    }

    
})





// Initialization
let currentMap = player.currentMap;
player.placeAt(currentMap.spawnTile.x, currentMap.spawnTile.y)


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

    currentMap.drawBG();
    currentMap.drawObjBG();
    player.draw();
    currentMap.drawFG();

    // testObj.draw()
    currentMap.drawObjFG();

    if (currentObj.script.isActive) {
        currentObj.runScript(player)
    }

    // let obj = new NPC ({
    //     name: 'Jack',
    //     prefix: 'That guy ',
    //     currentMap: currentMap
    // });
    lastFrameTime = currentFrameTime;
    requestAnimationFrame(animate);
}

animate()
