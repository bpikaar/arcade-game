class Game {
    private joystick    : Joystick

    private gameObjects : GameObject[] = []

    private textfield   : HTMLElement
    private startButton : HTMLElement
    private startFunction  : any

    private score       : number
    constructor() {
        let game : Element = document.getElementsByTagName("game")[0]!

        // score 
        this.textfield = document.createElement("textfield")
        this.textfield.innerHTML = "Appels: 0"
        game.appendChild(this.textfield)

        // kikker
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
        // bird
        this.gameObjects.push(new Bird(game))
        
        // Start Button
        this.startButton = new Button(
            game, 
            "START", 
            game.clientWidth / 2, 
            game.clientHeight / 2)

        this.startButton.addEventListener("click", () => this.startGame())

        // Joystick
        this.joystick = new Joystick(6)

        // save the exact function in a variable for removal 
        this.startFunction = () => this.startGame()
        document.addEventListener("button1", this.startFunction)
        document.addEventListener("button2", () => this.jump())
        document.addEventListener("button3", () => console.log('Button 3 fired'))
        document.addEventListener("button4", () => console.log('Button 4 fired'))
        document.addEventListener("button5", () => console.log('Button 5 fired'))
        document.addEventListener("button6", () => console.log('Button 6 fired'))

        this.gameLoop()
    }

    private startGame() {
        console.log("Start game!")
        document.dispatchEvent(new Event('init'))

        document.removeEventListener("button1", this.startFunction)
        this.startButton.removeEventListener("click", () => this.startGame())

        console.log(document)
        this.startButton.remove()
        this.score = 0
    }

    private gameLoop() : void {
        this.joystick.update()

        this.gameObjects.forEach(o => {
            if(o instanceof Kikker) {
                (o as Kikker).Left  = this.joystick.Left;
                (o as Kikker).Right = this.joystick.Right;

                this.gameObjects.forEach(secondObject => {
                    // Kikker has collision with a Apple
                    if(secondObject instanceof Apple) {
                        let apple = secondObject as Apple
                        if(o.checkCollision(apple)) {
                            o.onCollision()
                            apple.onCollision()
                            this.scorePoint(apple.Score)
                        }
                    }
                })
            }
            if(o instanceof Bird) {
                let bird = o as Bird
                if ( bird.Right <= 0 || bird.X >= window.innerWidth ) {
                    (o as Bird).init()
                }
            }
            
            o.update()
        })
        
        requestAnimationFrame(() => this.gameLoop())
    }

    private scorePoint(points: number) {
        this.score += points
        this.textfield.innerHTML = "Appels: " + this.score
    }
    private handleButton1Click() {
        console.log('Button 1 fired')
    }

    private jump() {
        console.log('Jump!')
    }
}

window.addEventListener("load", () => new Game())