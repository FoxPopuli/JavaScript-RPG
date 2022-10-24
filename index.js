import {Map} from './src/map.js';
import {Player} from './src/player.js';
import {Pokemon} from './src/pokemon.js'

export const canvas = document.querySelector('#game-screen');
export const ctx = canvas.getContext('2d');

// 16:9
canvas.height = 720;
canvas.width = (canvas.height/9)*16;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);



const clearing = new Map({
    position: {x: -500, y: -500}, 
    imgPath: './img/maps/the-clearing-demo.png'
})




const player = new Player ({
    name: 'Vox',
    isPlayer: true,
    prefix: 'Pokemon God ',
    gender: 'male'
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


let currentMap = clearing;

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

let i = 0;

currentMap.img.onload = () => {
    currentMap.draw()
    player.draw()

}

let walkOrRun = player.isRunning ? 'run' : 'walk'; 
let moveSpeed = 5;
function animate() {
    window.requestAnimationFrame(animate);

    // Movement
    if (testArr[testArr.length - 1] === 'w') {
        
        currentMap.position.y += moveSpeed;
        player.currentSprite = player.sprites[walkOrRun].up;
    
    } else if (testArr[testArr.length - 1] === 'a') {
        
        currentMap.position.x += moveSpeed;
        player.currentSprite = player.sprites[walkOrRun].left;
    
    } else if (testArr[testArr.length - 1] === 's') {
        
        currentMap.position.y -= moveSpeed;
        player.currentSprite = player.sprites[walkOrRun].down;
    
    } else if (testArr[testArr.length - 1] === 'd') {
        
        currentMap.position.x -= moveSpeed
        player.currentSprite = player.sprites[walkOrRun].right;

    }

    // if (keys.w.pressed && testArr[testArr.length - 1] === 'w') {
        
    //     currentMap.position.y += moveSpeed;
    //     player.currentSprite = player.sprites[walkOrRun].up;
    
    // } else if (keys.a.pressed && testArr[testArr.length - 1] === 'a') {
        
    //     currentMap.position.x += moveSpeed;
    //     player.currentSprite = player.sprites[walkOrRun].left;
    
    // } else if (keys.s.pressed && testArr[testArr.length - 1] === 's') {
        
    //     currentMap.position.y -= moveSpeed;
    //     player.currentSprite = player.sprites[walkOrRun].down;
    
    // } else if (keys.d.pressed && testArr[testArr.length - 1] === 'd') {
        
    //     currentMap.position.x -= moveSpeed
    //     player.currentSprite = player.sprites[walkOrRun].right;

    // }

    currentMap.draw();
    player.draw();
}

animate()