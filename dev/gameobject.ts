class GameObject extends HTMLElement {
    
    protected x         : number = 0
    protected y         : number = 0
    protected scaleX    : number = 1
    protected rotation  : number = 0
    
    public getRectangle() { return this.getBoundingClientRect() }

    constructor(game:Element) {
        super()
        
        game.appendChild(this)
    }

    public update() {
        this.draw()
    }

    protected draw() {
        this.style.transform = `translate(${this.x}px, ${this.y}px) scaleX(${this.scaleX}) rotate(${this.rotation}deg)`
    }

    public checkCollision(target : GameObject) : boolean {
        let a = this.getRectangle()
        let b = target.getRectangle()
        return (
            a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom)
    }

    public onCollision() : void { }
}