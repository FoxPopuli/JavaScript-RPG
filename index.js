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

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false}
}

let lastKey;
// let testArr = [];
window.addEventListener('keydown', (e) => {
    let walkOrRun = player.isRunning ? 'run' : 'walk'; 
    switch(e.key) {
        case 'w':
            keys.w.pressed = true; 
            lastKey = 'w';
            player.currentSprite = player.sprites[walkOrRun].up;
            break;

        case 'a': 
            keys.a.pressed = true;
            lastKey = 'a';
            player.currentSprite = player.sprites[walkOrRun].left;
            break;

        case 's':
            keys.s.pressed= true;
            lastKey = 's';
            player.currentSprite = player.sprites[walkOrRun].down;
            break;

        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            player.currentSprite = player.sprites[walkOrRun].right;
            break;

    }
})

window.addEventListener( 'keyup', (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
})

let i = 0;

currentMap.img.onload = () => {
    currentMap.draw()
    player.draw()

}

let moveSpeed = 5;
function animate() {
    window.requestAnimationFrame(animate);

    if (keys.w.pressed && lastKey === 'w') {currentMap.position.y += moveSpeed}
    else if (keys.a.pressed && lastKey === 'a') {currentMap.position.x += moveSpeed}
    else if (keys.s.pressed && lastKey === 's') {currentMap.position.y -= moveSpeed}
    else if (keys.d.pressed && lastKey === 'd') {currentMap.position.x -= moveSpeed}

    currentMap.draw();
    player.draw();
}

animate()