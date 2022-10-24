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

// clearing.draw();



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

// player.draw()
let currentMap = clearing;
let currentSprite = player.sprites.walk.down;

// Overworld controls
const binds = {
    up: 'w',
    left: 'a',
    down: 's',
    right: 'd'
} 

const keys = {
    w: {
        pressed: false
    },

    a: {
        pressed: false
    },

    s: {
        pressed: false
    },

    d: {
        pressed: false
    }
}

let lastKey;
window.addEventListener('keydown', (e) => {
    let walkOrRun = player.isRunning ? 'run' : 'walk'; 
    switch(e.key) {
        case 'w':
            keys.w.pressed = true; 
            lastKey = 'w';
            currentSprite = player.sprites[walkOrRun].up;
            break;

        case 'a': 
            keys.a.pressed = true;
            lastKey = 'a';
            currentSprite = player.sprites[walkOrRun].left;
            break;

        case 's':
            keys.s.pressed= true;
            lastKey = 's';
            currentSprite = player.sprites[walkOrRun].down;
            break;

        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            currentSprite = player.sprites[walkOrRun].right;
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

    console.log('map loaded')
    console.log(currentMap.img, currentSprite)
    ctx.drawImage(currentMap.img, currentMap.position.x, currentMap.position.y);
    ctx.drawImage(currentSprite, canvas.width / 2, canvas.height / 2);

}

let moveSpeed = 5;
function animate() {
    // console.log(i)
    window.requestAnimationFrame(animate);

    if (keys.w.pressed && lastKey === 'w') {currentMap.position.y += moveSpeed}
    else if (keys.a.pressed && lastKey === 'a') {currentMap.position.x += moveSpeed}
    else if (keys.s.pressed && lastKey === 's') {currentMap.position.y -= moveSpeed}
    else if (keys.d.pressed && lastKey === 'd') {currentMap.position.x -= moveSpeed}

    ctx.drawImage(currentMap.img, currentMap.position.x, currentMap.position.y);


    let scaleWidth = currentSprite.width / 3;
    // let scaleFactor = 1;
    // if (scaleFactor === 3) {
    //     scaleFactor = 0;
    // }

    ctx.drawImage(
        currentSprite,

        scaleWidth,
        // 0,
        0,

        scaleWidth,
        currentSprite.height,

        canvas.width / 2 - currentSprite.width / 3  + scaleWidth / 2, 
        canvas.height / 2 - currentSprite.height / 2 - 16,

        scaleWidth,
        currentSprite.height
        );
    // ctx.drawImage(player.sprites.walking, 0, 0);



    scaleFactor++;
}

animate()