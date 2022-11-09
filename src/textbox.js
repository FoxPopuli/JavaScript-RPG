import {ctx} from '../index.js';
import {canvas} from '../index.js';


export class Textbox {
    constructor (type, text) {
        this.type = type;
        this.text = text;
        this.drawFrom = {};

        this.img = new Image();
        this.img.src = `../img/textboxes/type-${this.type}.png`;

        this.dimensions = {
            x: this.img.width,
            y: this.img.height
        }

        switch (this.type) {
            case 1:
                this.drawFrom.x = canvas.width / 2 - this.img.width / 2;
                this.drawFrom.y = (8 * 16 + 4)*2;
                break;
        }

    }

    draw() {
        ctx.font = '24pt sans-serif';

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

        const drawFrom = this.drawFrom;


        ctx.fillText(
            this.text,

            this.drawFrom.x + 30,
            this.drawFrom.y + 300

        )
    }
}