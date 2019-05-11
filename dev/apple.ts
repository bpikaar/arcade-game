/// <reference path="gameobject.ts" />

class Apple extends GameObject {
    
    private speed : number = 4
    private fall : boolean = false
    
    private startX : number = 0
    private startY : number = 0

    constructor(game : Element, x : number, y : number) {
        super(game)
        
        this.startX = this.x = x
        this.startY = this.y = y
        
        this.draw()
        document.addEventListener('init', () => this.init())
    }

    private init() : void {
        setTimeout(() => this.fall = true, Math.round(Math.random() * 20) * 1000 );
    }

    public update() {
        if(this.fall) {
            this.y += this.speed
        }

        if (this.y > window.innerHeight) {
            this.respawn()
        }
        super.update()
    }

    private respawn() : void {
        this.x = this.startX
        this.y = this.startY
        this.fall = false
        this.init()
    }
    public onCollision() : void {
        this.remove()
    }
}

window.customElements.define("apple-component", Apple)