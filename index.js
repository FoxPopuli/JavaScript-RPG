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
canvas.height = 2080;
canvas.width = (canvas.height/9)*16;


// Globals

// Tile dimensions
const tileW = 16*4;
const tileH = 16*4;

let currentSecond = 0;
let frameCount = 0;
let framesLastSecond = 0;
let lastFrameTime = 0;

const clearing = new Map({
    // position: {x: -500, y: -500}, 
    position: {x: 0, y: 0},
    imgPath: './img/maps/the-clearing-demo-grid.png',
    mapFile: clearingMapFile
})


const player = new Player ({
    name: 'Vox',
    isPlayer: true,
    prefix: 'Pokemon God ',
    gender: 'male',
    currentMap: clearing
})


const sampleStats = {
    hp: 10,
    atk: 10,
    def: 10,
    spatk: 10,
    spdef: 10,
    spd: 10
}
const mon = new Pokemon ({
    name: 'Charmander', 
    level: 5, 
    type: ['Fire'], 
    baseStats: sampleStats, 
    // moves: [tackle, growl, megaBeam, hypnosis], 
    isPlayer: true
})


let currentMap = player.currentMap;
// console.log(currentMap.layers)
// Overworld controls
const binds = {
    up: 'w',
    left: 'a',
    down: 's',
    right: 'd'
} 

let testArr = [];


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

window.onload = function () {
    currentMap.draw()
    // requestAnimationFrame(animate);

}

// console.log(currentMap.colMat)
let walkOrRun = player.isRunning ? 'run' : 'walk'; 
let moveSpeed = 10;
player.placeAt(10, 10)
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


    // Movement 2
    // if (!player.processMovement(currentFrameTime)) {
        
    //     if (currentKey === 'w' && currentMap.colMat[player.tileFrom.y - 1][player.tileFrom.x] === 0) {
    //         player.tileTo.y -= 1;
    //     } else if (currentKey === 's' && currentMap.colMat[player.tileFrom.y + 1][player.tileFrom.x] === 0) {
    //         player.tileTo.y += 1;
    //     } else if (currentKey === 'a' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x - 1] === 0) {
    //         player.tileTo.x -= 1;
    //     } else if (currentKey === 'd' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x + 1] === 0) {
    //         player.tileTo.x += 1;
    //     }
    // }

    // Movement 3
    if (!player.processMovement(currentFrameTime)) {
        if (currentKey === 'w' && currentMap.colMat[player.tileFrom.y - 1][player.tileFrom.x] === 0) {
            player.tileTo.y -= 1;
            player.currentSprite = player.sprites[walkOrRun].up;
        } else if (currentKey === 's' && currentMap.colMat[player.tileFrom.y + 1][player.tileFrom.x] === 0) {
            player.tileTo.y += 1;

            player.currentSprite = player.sprites[walkOrRun].down
        } else if (currentKey === 'a' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x - 1] === 0) {
            player.tileTo.x -= 1;
            player.currentSprite = player.sprites[walkOrRun].left;
        } else if (currentKey === 'd' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x + 1] === 0) {
            player.tileTo.x += 1;
            player.currentSprite = player.sprites[walkOrRun].right
        }

        if (player.tileFrom.x !== player.tileTo.x || player.tileFrom.y !== player.tileTo.y) {
            player.timeMoved = currentFrameTime;
        }

    }

   // Movement 4
    // if (true) {
    //     if (currentKey === 'w') {
    //         player.position.y -= 1;
    //         console.log(currentKey)
    //     } else if (currentKey === 's') {
    //         player.position.y += 1;
    //     } else if (currentKey === 'a') {
    //         player.position.x -= 1;
    //     } else if (currentKey === 'd') {
    //         player.position.x += 1;
    //     }
    // }

    // Movement 5
    // if (!player.processMovement(currentFrameTime)) {
    //     if (currentKey === 'w' && currentMap.colMat[player.tileFrom.y - 1][player.tileFrom.x] === 0) {
    //         player.position.y -= 1;
    //     } else if (currentKey === 's' && currentMap.colMat[player.tileFrom.y + 1][player.tileFrom.x] === 0) {
    //         player.position.y += 1;
    //     } else if (currentKey === 'a' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x - 1] === 0) {
    //         player.position.x -= 1;
    //     } else if (currentKey === 'd' && currentMap.colMat[player.tileFrom.y][player.tileFrom.x + 1] === 0) {
    //         player.position.x += 1;
    //     }
    // }





    ctx.fillStyle = 'red';
    // console.log('FPS: ' + framesLastSecond);









    
    // Movement
    // if (currentKey === 'w') {
        
    //     currentMap.position.y += moveSpeed;
    //     player.currentSprite = player.sprites[walkOrRun].up;
    
    // } else if (currentKey === 'a') {
        
    //     currentMap.position.x += moveSpeed;
    //     ;
    
    // } else if (currentKey === 's') {
        
    //     currentMap.position.y -= moveSpeed;
    //     ;
    
    // } else if (currentKey === 'd') {
        
    //     currentMap.position.x -= moveSpeed
    //     ;

    // }


    
    // player.placeAt(0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentMap.draw();

    player.draw()

    // ctx.fillRect(player.position.x, player.position.y, player.dimensions.x, player.dimensions.y);

    player.showPos()

    lastFrameTime = currentFrameTime;

    requestAnimationFrame(animate);
}

// window.onload = requestAnimationFrame(ani)
animate()
