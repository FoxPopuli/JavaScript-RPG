import {ctx} from '../index.js';
import {canvas} from '../index.js';

export class Textbox {
    constructor (text) {
        this.text = text;

        let splitText = text.split(' ');
        this.text1 = '';
        this.text2 = '';
        this.text3 = '';

        this.charPerLine = 34
        this.lineSpacing = 40;
        splitText.forEach (word => {
            
            if (this.text1.length <= this.charPerLine) {
                this.text1 += (word + ' ');

            } else if (this.text2.length <= this.charPerLine){
                this.text2 += (word + ' ');
            } else if (this.text3.length <= this.charPerLine){
                this.text3 += (word + ' ');
            } else {
                throw 'TEXTBOX ERROR: Text too long.'
            }
        })

        this.textOffset = {x: 30, y: 290};

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
            this.text1,

            this.drawFrom.x + this.textOffset.x,
            this.drawFrom.y + this.textOffset.y
        )

        if (this.text2) {
            ctx.fillText(
                this.text2,
    
                this.drawFrom.x + this.textOffset.x,
                this.drawFrom.y + this.textOffset.y + this.lineSpacing
            )
        }

        if (this.text3) {
            ctx.fillText(
                this.text3,
    
                this.drawFrom.x + this.textOffset.x,
                this.drawFrom.y + this.textOffset.y +this.lineSpacing * 2
            )
        }
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