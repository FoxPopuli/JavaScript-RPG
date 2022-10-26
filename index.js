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
    type:       ['Fire'], 
    baseStats:  sampleStats, 
    // moves: [tackle, growl, megaBeam, hypnosis], 
    isPlayer:   true
})







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
        // this.report()
        console.log('viewport.update()')
        // px, py : pixel coords of the center of the viewport
        this.offset.x = Math.floor((this.screen.x / 2) - px);
        this.offset.y = Math.floor((this.screen.y / 2) - py);

        console.log(px, py)
        let tile = {
            x: Math.floor(px/tileW),
            y: Math.floor(py/tileH) 
        }



        // this.report()
        console.log(this.screen)
        this.startTile.x = tile.x - 1 - Math.ceil((this.screen.x / 2) / tileW)
        this.startTile.y = tile.y - 1 - Math.ceil((this.screen.y / 2) / tileH)
        // this.report()


        if (this.startTile.x < 0) {this.startTile.x = 0;}
        if (this.startTile.y < 0) {this.startTile.y = 0;}

        this.endTile.x = tile.x + 1 + Math.ceil((this.screen.x / 2) / tileW);
        this.endTile.y = tile.y + 1 + Math.ceil((this.screen.y / 2) / tileH);

        if (this.endTile.x >= currentMap.mapFile.width) {this.endTile.x = currentMap.mapFile.width - 1;}
        if (this.endTile.y >= currentMap.mapFile.height) {this.endTile.y = currentMap.mapFile.height - 1;}
    }
}


// currentMap.viewport = viewport;

let testArr = [];


const clearing = new Map({
    // position: {x: -500, y: -500}, 
    position: {x: 0, y: 0},
    imgPath: './img/maps/the-clearing-demo-grid.png',
    mapFile: clearingMapFile,
    viewport: viewport
})


const player = new Player ({
    name:       'Vox',
    isPlayer:   true,
    prefix:     'Pokemon God ',
    gender:     'male',
    currentMap:  clearing
})


let currentMap = player.currentMap;
viewport.update(clearing.spawnTile.x * tileW, clearing.spawnTile.y * tileH)
// OVERWORLD CONTROLS

// Keybinds
const binds = {
    up: 'w',
    left: 'a',
    down: 's',
    right: 'd'
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


window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':

            testArr.pushOnce('w');
            break;

        case 'a': 
            testArr.pushOnce('a');
            break;

        case 's':
            testArr.pushOnce('s')
            break;

        case 'd':
            testArr.pushOnce('d')
            break;

    }
})

window.addEventListener( 'keyup', (e) => {
    switch (e.key) {
        case 'w':
            testArr.splice(testArr.indexOf(e.key), 1);
            break;
        case 'a':
            testArr.splice(testArr.indexOf(e.key), 1);
            break;
        case 's':
            testArr.splice(testArr.indexOf(e.key), 1);
            break;
        case 'd':
            testArr.splice(testArr.indexOf(e.key), 1);
            break;
    }
})

window.addEventListener ('keydown', (e) => {
    if (e.key !== 'Shift') return;

    if (player.isRunning) {
        player.isRunning = false
    } else {
        player.isRunning = true
    }

})



player.placeAt(currentMap.spawnTile, currentMap.spawnTile)

// viewport.screen.x = canvas.width;
// viewport.screen.y = canvas.height;



// }


// let  testobj = {yes: 1, no: 4}
// console.log(testobj)



function animate() {
    let currentKey = testArr[testArr.length - 1];
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
    if (!player.processMovement(currentFrameTime)) {
        if (currentKey === 'w' && currentMap.colMat[player.tileFrom.y - 1][player.tileFrom.x] === 0) {

            player.direction = 'up';
            player.tileTo.y -= 1;
            player.steps++;

        } else if (currentKey === 's' && currentMap.colMat[player.tileFrom.y + 1][player.tileFrom.x] === 0) {

            player.direction = 'down';
            player.tileTo.y += 1;
            player.steps++;

        } else if (currentKey === 'a' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x - 1] === 0) {

            player.direction = 'left';
            player.tileTo.x -= 1;
            player.steps++;

        } else if (currentKey === 'd' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x + 1] === 0) {

            player.direction = 'right';
            player.tileTo.x += 1;
            player.steps++;
        }

        if (player.tileFrom.x !== player.tileTo.x || player.tileFrom.y !== player.tileTo.y) {
            player.timeMoved = currentFrameTime;
        }

    }


    console.log('P:')
    console.log(player.position.x)

    viewport.update( 
        player.position.x + (player.dimensions.x / 2),
        player.position.y + (player.dimensions.y / 2)
        // player.position.x,
        // player.position.y
        
    
    );

    console.log(viewport)

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, viewport.screen.x, viewport.screen.y)

    currentMap.draw();
    player.draw()





    lastFrameTime = currentFrameTime;
    requestAnimationFrame(animate);
}

// window.onload = requestAnimationFrame(ani)
animate()
