/// <reference path="gameobject.ts" />

class Button extends GameObject {
    constructor(game:Element, text : string, x : number, y : number) {
        super(game)
        this.innerHTML = text

        this.x = x - this.clientWidth/2
        this.y = y - this.clientHeight/2

        this.draw()
    }
}

window.customElements.define("button-component", Button)