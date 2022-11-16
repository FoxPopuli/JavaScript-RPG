export const malePlayerSprites = {};

// Walk
malePlayerSprites.walk = {};
malePlayerSprites.walk.left = new Image();
malePlayerSprites.walk.left.src = `./img/sprites/player/male/walk-left.png`
malePlayerSprites.walk.up = new Image();
malePlayerSprites.walk.up.src = `./img/sprites/player/male/walk-up.png`
malePlayerSprites.walk.down = new Image();
malePlayerSprites.walk.down.src = `./img/sprites/player/male/walk-down.png`
malePlayerSprites.walk.right = new Image();
malePlayerSprites.walk.right.src = `./img/sprites/player/male/walk-right.png`

// Run
malePlayerSprites.run = {};
malePlayerSprites.run.left = new Image();
malePlayerSprites.run.left.src = `./img/sprites/player/male/run-left.png`
malePlayerSprites.run.up = new Image();
malePlayerSprites.run.up.src = `./img/sprites/player/male/run-up.png`
malePlayerSprites.run.down = new Image();
malePlayerSprites.run.down.src = `./img/sprites/player/male/run-down.png`
malePlayerSprites.run.right = new Image();
malePlayerSprites.run.right.src = `./img/sprites/player/male/run-right.png`

// Surf
malePlayerSprites.surf = {};
malePlayerSprites.surf.left = new Image();
malePlayerSprites.surf.left.src = `./img/sprites/player/male/surf-left.png`
malePlayerSprites.surf.up = new Image();
malePlayerSprites.surf.up.src = `./img/sprites/player/male/surf-up.png`
malePlayerSprites.surf.down = new Image();
malePlayerSprites.surf.down.src = `./img/sprites/player/male/surf-down.png`
malePlayerSprites.surf.right = new Image();
malePlayerSprites.surf.right.src = `./img/sprites/player/male/surf-right.png`

malePlayerSprites.default = new Image;
malePlayerSprites.default.src = `./img/sprites/player/male/walk-down.png`

const directions = ['up', 'down', 'left', 'right'];

function SpriteObj (type, gender) {
    this.walk = {};
    for (let direction of directions) {
        this.walk[direction] = new Image();
        this.walk[direction].src = `./img/sprites/${this.type}/${this.gender}/walk-${direction}.png`;
    }
}

// export const defaultSprites = SpriteObj ()