import {Map} from './src/map.js';
import {Player} from './src/player.js';

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

