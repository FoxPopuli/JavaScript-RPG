import {Map} from './src/map.js';
import {Player} from './src/player.js';
import {Pokemon} from './src/pokemon.js'

export const canvas = document.querySelector('#game-screen');
export const ctx = canvas.getContext('2d');

// 16:9

canvas.height = 480;
canvas.width = (canvas.height/9)*16;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);



const clearing = new Map({
    position: {x: -500, y: -500}, 
    imgPath: './img/maps/the-clearing-demo.png',
    ctx: ctx
})

clearing.draw();


const player = new Player ({
    name: 'Vox',
    isPlayer: true,
    prefix: 'Pokemon God ',
    imgPath: './img/maps/the-clearing-demo.png'
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



