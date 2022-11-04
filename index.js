import {Map} from './src/map.js';
import {Player} from './src/player.js';
import {Pokemon} from './src/pokemon.js'
// import {toIndex} from './src/useful-functions.js';

// mapFiles
import clearingMapFile from './src/the-clearing-demo-mapfile.json' assert {type: 'json'};

export const canvas = document.querySelector('#game-screen');
export const ctx = canvas.getContext('2d');
ctx.font = 'bold 10pt sans-serif';

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





const clearing = new Map({
    position: {x: 0, y: 0},
    imgPath: './img/maps/the-clearing-demo-grid.png',
    mapFile: clearingMapFile,
    viewport: viewport
})

const sampleStats = {
    hp:     10,
    atk:    10,
    def:    10,
    spatk:  10,
    spdef:  10,
    spd:    10
}
const mon = new Pokemon ({
    name:       'Charmander', 
    level:      5, 
    type:       ['Fire', 'Water'], 
    baseStats:  sampleStats, 
    // moves: [tackle, growl, megaBeam, hypnosis], 
    isPlayer:   true
})

const player = new Player ({
    name:       'Vox',
    isPlayer:   true,
    prefix:     'Pokemon God ',
    gender:     'male',
    currentMap:  clearing
})

player.party.push(mon)
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
    if (this[this.length - 1] !== key) {
        this.push(key);
    }
}

const moveArr = [];
window.addEventListener('keydown', (e) => {
    if (Object.values(binds.movement).includes(e.key)) {
        moveArr.pushOnce(e.key);
    }

    switch (e.key) {
        case 'e':
            player.interact();
            break
    }
})

window.addEventListener( 'keyup', (e) => {
    if (Object.values(binds.movement).includes(e.key)) {
        moveArr.splice(moveArr.indexOf(e.key), 1);
    }
})

window.addEventListener ('keydown', (e) => {
    if (e.key !== 'Shift') return;

    if (player.moveType === 'surf' || player.moveType === 'cycle') return;

    if (player.moveType === 'run') {
        player.moveType = 'walk';
    } else {
        player.moveType = 'run';
    }
})




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

    // console.log(player.tileFacing)

    lastFrameTime = currentFrameTime;
    requestAnimationFrame(animate);
}

animate()
