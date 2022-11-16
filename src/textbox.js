import {ctx} from '../index.js';
import {canvas} from '../index.js';

export class Textbox {
    constructor (text) {
        this.text = text;

        this.textOffset = {x: 30, y: 300};

        this.img = new Image();
        this.img.src = `../img/textboxes/type-1.png`;

        this.drawFrom = {x: canvas.width / 2 - this.img.width / 2, y: 264};
    }

    draw() {
        ctx.drawImage (
            this.img, 

            this.drawFrom.x,
            this.drawFrom.y,
        )

        ctx.font = '24pt sans-serif';
        ctx.fillText(
            this.text,

            this.drawFrom.x + this.textOffset.x,
            this.drawFrom.y + this.textOffset.y
        )
    }
}

export class Menu {
    constructor(choices) {

        this.textOffset = {x: 150, y: 300};
        this.choices = choices;
        this.isMenu = true;

        this.choiceIndex = 0;

        this.img = new Image();
        this.img.src = '../img/textboxes/yes-or-no.png';
        this.drawFrom = {x: 550, y: 134};

        this.cursorImg = new Image();
        this.cursorImg.src = '../img/textboxes/cursor.png';
    }


    draw() {

        // Draw image
        ctx.drawImage (
            this.img, 

            this.drawFrom.x,
            this.drawFrom.y,
        )

        // Draw text
        ctx.font = '24pt sans-serif';
        for (let i = 0; i < this.choices.length; i++) {
            ctx.fillText(
                this.choices[i],

                this.drawFrom.x + this.textOffset.x + 90,
                this.drawFrom.y + this.textOffset.y - 20 + 35*i
            )
        }

        // Draw cursor
        if (this.choiceIndex > this.choices.length - 1) this.choiceIndex = 0;
        if (this.choiceIndex < 0) this.choiceIndex = this.choices.length - 1;

        ctx.drawImage (
            this.cursorImg, 

            this.drawFrom.x + this.textOffset.x - this.cursorImg.width + 90,
            this.drawFrom.y + this.textOffset.y - 50 + 35*this.choiceIndex
            
        )

    }
}