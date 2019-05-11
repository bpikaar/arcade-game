/// <reference path="gameobject.ts" />


class Bird extends GameObject {

    private direction : number = 0
    private speed :     number = 4

    public get X() : number { return this.x }
    public get Right() : number { return this.x + this.clientWidth }

    public goUpdate : boolean = false

    constructor(game : Element) {
        super(game)

        this.init()
    }

    public init() {
        if(Math.random() < 0.5) {
            this.x = -this.clientWidth + 1
            this.direction = 1
            this.scaleX = -1
        }
        else {
            this.x = window.innerWidth - 1
            this.direction = -1
            this.scaleX = 1
        }
        this.y = Math.random() * window.innerHeight * 0.3
        this.goUpdate = false
        setTimeout(() => {
            this.goUpdate = true
        }, (Math.floor(Math.random() * 10) + 2) * 1000)
        this.draw()
    }

    public update() {
        if(this.goUpdate) {
            this.x += this.speed * this.direction
            super.update()
        }
    }
}

window.customElements.define("bird-component", Bird)