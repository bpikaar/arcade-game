/// <reference path="gameobject.ts" />

class Apple extends GameObject {
    
    private speed : number = 4
    private fall : boolean = false
    
    constructor(game : Element, x : number, y : number) {
        super(game)
        
        this.x = x
        this.y = y
        
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
        super.update()
    }

    public onCollision() : void {
        this.remove()
    }
}

window.customElements.define("apple-component", Apple)