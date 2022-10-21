import {Map} from './src/map.js';

const canvas = document.querySelector('#game-screen');
const ctx = canvas.getContext('2d');

// 16:9

canvas.height = 1080;
canvas.width = (canvas.height/9)*16;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.widht, canvas.height);



class Player {
    constructor({ name,})
}

const clearing = new Map({x: -500, y: -500}, './img/maps/the-clearing-demo.png')


clearing.draw();