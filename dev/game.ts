class Game {
    private joystick : Joystick

    private gameObjects : GameObject[] = []
    constructor() {
        let game : Element = document.getElementsByTagName("game")[0]!

        this.gameObjects.push(new Kikker(game))
        // apples
        this.gameObjects.push(new Apple(game, 110, 100))
        this.gameObjects.push(new Apple(game, 1000, 100))
        this.gameObjects.push(new Apple(game, 200, 200))
        this.gameObjects.push(new Apple(game, 300, 70))
        this.gameObjects.push(new Apple(game, 350, 100))
        this.gameObjects.push(new Apple(game, 400, 20))
        this.gameObjects.push(new Apple(game, 500, 50))
        this.gameObjects.push(new Apple(game, 600, 100))
        this.gameObjects.push(new Apple(game, 700, 150))
        this.gameObjects.push(new Apple(game, 750, 280))
        this.gameObjects.push(new Apple(game, 800, 300))
        
        
        this.joystick = new Joystick(6)
        document.addEventListener("button1", () => this.handleButton1Click())
        document.addEventListener("button2", () => this.jump())
        document.addEventListener("button3", () => console.log('Button 3 fired'))
        document.addEventListener("button4", () => console.log('Button 4 fired'))
        document.addEventListener("button5", () => console.log('Button 5 fired'))
        document.addEventListener("button6", () => console.log('Button 6 fired'))

        this.gameLoop()
    }

    private gameLoop() : void {
        this.joystick.update()

        this.gameObjects.forEach(o => {
            if(o instanceof Kikker) {
                (o as Kikker).Left  = this.joystick.Left;
                (o as Kikker).Right = this.joystick.Right;

                this.gameObjects.forEach(secondObject => {
                    if(o !== secondObject) {
                        if(o.checkCollision(secondObject)) {
                            o.onCollision()
                            secondObject.onCollision()
                        }
                    }
                })
            }

            
            o.update()
        })
        
        requestAnimationFrame(() => this.gameLoop())
    }

    private handleButton1Click() {
        console.log('Button 1 fired')
    }

    private jump() {
        console.log('Jump!')
    }
}

window.addEventListener("load", () => new Game())