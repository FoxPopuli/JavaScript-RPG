const directions = ['up', 'down', 'left', 'right'];
function SpriteObj (spriteID, moveTypes) {
    
    this.spriteID = spriteID;
    for (let moveType of moveTypes) {
        this[moveType] = {};
        for (let direction of directions) { 
            this[moveType][direction] = new Image();
            this[moveType][direction].src = `./img/sprites/${this.spriteID}/${moveType}-${direction}.png`;
        }
    }
    this.default = this.walk.down

}



const malePlayerSprites = new SpriteObj('malePlayer', ['walk', 'run', 'surf']);

// export const schoolBoySprites = new SpriteObj('schoolBoy', ['walk']);

// export const defaultSprites = SpriteObj ()

export const allSprites = {
    malePlayer: malePlayerSprites,

}