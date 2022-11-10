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

    drawText() {
        ctx.font = '24pt sans-serif';
        ctx.fillText(
            this.text,

            this.drawFrom.x + this.textOffset.x,
            this.drawFrom.y + this.textOffset.y

        )
    }

    draw() {
        this.drawImg();
        this.drawText();
    }
}

export class Menu extends Textbox {
    constructor(choices) {
        super();
        this.textOffset = {x: 150, y: 300};
        this.choices = choices;
        this.isMenu = true;

        this.choiceIndex = 0;

        this.img = new Image();
        this.img.src = '../img/textboxes/yes-or-no.png';

        this.drawFrom = {x: canvas.width / 2 - this.img.width / 2, y: (8 * 16 + 4)*2};

        this.dimensions = {
            x: this.img.width,
            y: this.img.height
        }
    

        this.cursorImg = new Image();
        this.cursorImg.src = '../img/textboxes/cursor.png';

    }

    drawText() {

        ctx.font = '24pt sans-serif';



        for (let i = 0; i < this.choices.length; i++) {
            ctx.fillText(
                this.choices[i],

                this.drawFrom.x + this.textOffset.x + 90,
                this.drawFrom.y + this.textOffset.y - 20 + 35*i
            )
        }

    }

    drawCursor() {




        if (this.choiceIndex > this.choices.length - 1) {
            this.choiceIndex = 0;
        }  
        if (this.choiceIndex < 0) {
            this.choiceIndex = this.choices.length - 1;
        }

        ctx.drawImage (
            this.cursorImg, 

            this.drawFrom.x + this.textOffset.x - this.cursorImg.width + 90,
            this.drawFrom.y + this.textOffset.y - 50 + 35*this.choiceIndex
            
        )
        console.log(this.choiceIndex)


    }

    draw() {
        this.drawImg();
        this.drawText();
        this.drawCursor();
    }
}