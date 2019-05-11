class GameObject extends HTMLElement {
    
    protected x : number = 0
    protected y : number = 0

    protected scaleX : number = 1
    
    constructor(game:Element) {
        super()
        
        game.appendChild(this)
    }

    public update() {
        this.draw()
    }

    protected draw() {
        this.style.transform = `translate(${this.x}px, ${this.y}px) scaleX(${this.scaleX})`
    }

    public checkCollision(target : Element) : boolean {
        let a = this.getBoundingClientRect()
        let b = target.getBoundingClientRect()
        return (
            a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom)
    }

    public onCollision() : void { }
}