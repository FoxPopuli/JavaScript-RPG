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



// Overworld controls 
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 's':
            console.log(e.key)
            currentMap.position.y -= 16;
            console.log(currentMap.position)
            break;
        case 'w': 
            currentMap.position.y += 16;
            break;

        case 'a': 
            currentMap.position.x += 16;
            break;
        
        case 'd':
            currentMap.position.x -= 16;

    }
})


let i = 0;
currentMap.img.onload = () => {

    ctx.drawImage(currentMap.img, currentMap.position.x, currentMap.position.y);
    ctx.drawImage(player.sprites.walking, canvas.width / 2, canvas.height / 2);

}
function animate() {
    console.log(i)
    window.requestAnimationFrame(animate);
    ctx.drawImage(currentMap.img, currentMap.position.x, currentMap.position.y);
    ctx.drawImage(player.sprites.walking, canvas.width / 2, canvas.height / 2);
    // ctx.drawImage(player.sprites.walking, 0, 0);



    i++;
}

// animate()