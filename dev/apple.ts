/// <reference path="gameobject.ts" />

class Apple extends GameObject {
    
    private speed : number  = 4
    private rotationSpeed : number = 0
    private fall  : boolean = false
    
    private startX : number = 0
    private startY : number = 0

    private score  : number = 100
    private scoreField : HTMLElement

    /**
     * Getter Score
     * @return {number }
     */
	public get Score(): number  {
		return this.score;
	}

    constructor(game : Element, x : number, y : number) {
        super(game)
        
        this.startX = this.x = x
        this.startY = this.y = y
        
        this.scoreField = document.createElement("apple-score")
        this.scoreField.innerHTML = ""+this.score
        this.appendChild(this.scoreField)
        
        this.draw()
        document.addEventListener('init', () => this.init())
    }

    private init() : void {
        this.rotationSpeed = Math.random() * 5 + 2
        // Rotate left or right
        this.rotationSpeed *= Math.random() < 0.5 ? 1 : -1

        setTimeout(() => this.fall = true, Math.round(Math.random() * 20) * 1000 );
    }

    public update() {
        if(this.fall) {
            this.y += this.speed
            this.rotation += this.rotationSpeed
        }

        if (this.y > window.innerHeight) {
            this.respawn()
        }
        super.update()
    }

    private respawn() : void {
        this.x      = this.startX
        this.y      = this.startY
        this.fall   = false
        this.rotation = 0
        if(this.score > 0) this.score  -= 25
        this.scoreField.innerHTML = ""+this.score

        this.init()
    }
    public onCollision() : void {
        this.remove()
    }
}

window.customElements.define("apple-component", Apple)