import {ctx} from '../index.js';
import {canvas} from '../index.js';


export class Textbox {
    constructor (text) {
        this.text = text;

        this.textOffset = {x: 30, y: 300};

        this.img = new Image();
        this.img.src = `../img/textboxes/type-1.png`;

        this.drawFrom = {x: canvas.width / 2 - this.img.width / 2, y: (8 * 16 + 4)*2};

        this.dimensions = {
            x: this.img.width,
            y: this.img.height
        }


    }

    drawImg() {


        ctx.drawImage (
            this.img, 

            0,
            0,

            this.dimensions.x,
            this.dimensions.y,

            this.drawFrom.x,
            this.drawFrom.y,

            this.dimensions.x,
            this.dimensions.y
        )



    }

    // processText() {
    //     const textArr = [];
    //     const widthRatio = ctx.measureText(this.text) / this.img.width;
    //     if (widthRatio) {

    //     }
    // }

    drawText() {
        ctx.font = '24pt sans-serif';
        ctx.fillText(
            this.text,

            this.drawFrom.x + this.textOffset.x,
            this.drawFrom.y + this.textOffset.y

        )
    }
}

export class Menu extends Textbox {
    constructor(choices) {
        super();
        this.choices = choices;
        this.drawFrom = {x: canvas.width / 2 - this.img.width / 2, y: (8 * 16 + 4)*2};
        this.choice = null;

        this.img = new Image();
        this.img.src = '../img/textboxes/yes-or-no.png';

    
    }

    drawText() {

        ctx.font = '24pt sans-serif';

        ctx.fillText(
            this.choices[0],

            this.drawFrom.x + this.textOffset.x,
            this.drawFrom.y + this.textOffset.y

        )

        ctx.fillText (
            this.choices[1],
            this.drawFrom.x + this.textOffset.x,
            this.drawFrom.y + this.textOffset.y + 20,

        )
    }
}