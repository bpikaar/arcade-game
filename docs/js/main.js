"use strict";
class GameObject extends HTMLElement {
    constructor(game) {
        super();
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.rotation = 0;
        game.appendChild(this);
    }
    getRectangle() { return this.getBoundingClientRect(); }
    update() {
        this.draw();
    }
    draw() {
        this.style.transform = `translate(${this.x}px, ${this.y}px) scaleX(${this.scaleX}) rotate(${this.rotation}deg)`;
    }
    checkCollision(target) {
        let a = this.getRectangle();
        let b = target.getRectangle();
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    }
    onCollision() { }
}
class Apple extends GameObject {
    constructor(game, x, y) {
        super(game);
        this.speed = 4;
        this.rotationSpeed = 0;
        this.fall = false;
        this.startX = 0;
        this.startY = 0;
        this.score = 100;
        this.startX = this.x = x;
        this.startY = this.y = y;
        this.scoreField = document.createElement("apple-score");
        this.scoreField.innerHTML = "" + this.score;
        this.appendChild(this.scoreField);
        this.draw();
        document.addEventListener('init', () => this.init());
    }
    get Score() {
        return this.score;
    }
    init() {
        this.rotationSpeed = Math.random() * 5 + 2;
        this.rotationSpeed *= Math.random() < 0.5 ? 1 : -1;
        setTimeout(() => this.fall = true, Math.round(Math.random() * 20) * 1000);
    }
    update() {
        if (this.fall) {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
        }
        if (this.y > window.innerHeight) {
            this.respawn();
        }
        super.update();
    }
    respawn() {
        this.x = this.startX;
        this.y = this.startY;
        this.fall = false;
        this.rotation = 0;
        if (this.score > 0)
            this.score -= 25;
        this.scoreField.innerHTML = "" + this.score;
        this.init();
    }
    onCollision() {
        this.remove();
    }
}
window.customElements.define("apple-component", Apple);
class Bird extends GameObject {
    constructor(game) {
        super(game);
        this.direction = 0;
        this.speed = 4;
        this.goUpdate = false;
        this.init();
    }
    get X() { return this.x; }
    get Right() { return this.x + this.clientWidth; }
    init() {
        if (Math.random() < 0.5) {
            this.x = -this.clientWidth + 1;
            this.direction = 1;
            this.scaleX = -1;
        }
        else {
            this.x = window.innerWidth - 1;
            this.direction = -1;
            this.scaleX = 1;
        }
        this.y = Math.random() * window.innerHeight * 0.3;
        this.goUpdate = false;
        setTimeout(() => {
            this.goUpdate = true;
        }, (Math.floor(Math.random() * 10) + 2) * 1000);
        this.draw();
    }
    update() {
        if (this.goUpdate) {
            this.x += this.speed * this.direction;
            super.update();
        }
    }
}
window.customElements.define("bird-component", Bird);
class Button extends GameObject {
    constructor(game, text, x, y) {
        super(game);
        this.innerHTML = text;
        this.x = x - this.clientWidth / 2;
        this.y = y - this.clientHeight / 2;
        this.draw();
    }
}
window.customElements.define("button-component", Button);
class Game {
    constructor() {
        this.gameObjects = [];
        let game = document.getElementsByTagName("game")[0];
        this.textfield = document.createElement("textfield");
        this.textfield.innerHTML = "Appels: 0";
        game.appendChild(this.textfield);
        this.gameObjects.push(new Kikker(game));
        this.gameObjects.push(new Apple(game, 110, 100));
        this.gameObjects.push(new Apple(game, 1000, 100));
        this.gameObjects.push(new Apple(game, 200, 200));
        this.gameObjects.push(new Apple(game, 300, 70));
        this.gameObjects.push(new Apple(game, 350, 100));
        this.gameObjects.push(new Apple(game, 400, 20));
        this.gameObjects.push(new Apple(game, 500, 50));
        this.gameObjects.push(new Apple(game, 600, 100));
        this.gameObjects.push(new Apple(game, 700, 150));
        this.gameObjects.push(new Apple(game, 750, 280));
        this.gameObjects.push(new Apple(game, 800, 300));
        this.gameObjects.push(new Bird(game));
        this.startButton = new Button(game, "START", window.innerWidth / 2, window.innerHeight / 2);
        this.startButton.addEventListener("click", () => this.startGame());
        this.joystick = new Joystick(6);
        this.startFunction = () => this.startGame();
        document.addEventListener("button1", this.startFunction);
        document.addEventListener("button2", () => this.jump());
        document.addEventListener("button3", () => console.log('Button 3 fired'));
        document.addEventListener("button4", () => console.log('Button 4 fired'));
        document.addEventListener("button5", () => console.log('Button 5 fired'));
        document.addEventListener("button6", () => console.log('Button 6 fired'));
        this.gameLoop();
    }
    startGame() {
        console.log("Start game!");
        document.dispatchEvent(new Event('init'));
        document.removeEventListener("button1", this.startFunction);
        this.startButton.removeEventListener("click", () => this.startGame());
        console.log(document);
        this.startButton.remove();
        this.score = 0;
    }
    gameLoop() {
        this.joystick.update();
        this.gameObjects.forEach(o => {
            if (o instanceof Kikker) {
                o.Left = this.joystick.Left;
                o.Right = this.joystick.Right;
                this.gameObjects.forEach(secondObject => {
                    if (secondObject instanceof Apple) {
                        let apple = secondObject;
                        if (o.checkCollision(apple)) {
                            o.onCollision();
                            apple.onCollision();
                            this.scorePoint(apple.Score);
                        }
                    }
                });
            }
            if (o instanceof Bird) {
                let bird = o;
                if (bird.Right <= 0 || bird.X >= window.innerWidth) {
                    o.init();
                }
            }
            o.update();
        });
        requestAnimationFrame(() => this.gameLoop());
    }
    scorePoint(points) {
        this.score += points;
        this.textfield.innerHTML = "Appels: " + this.score;
    }
    handleButton1Click() {
        console.log('Button 1 fired');
    }
    jump() {
        console.log('Jump!');
    }
}
window.addEventListener("load", () => new Game());
class Joystick {
    constructor(numOfButtons) {
        this.DEBUG = false;
        this.buttons = [];
        this.buttonEvents = [];
        this.numberOfBUttons = 0;
        this.x = 0;
        this.y = 0;
        this.axes = [];
        this.isConnected = false;
        this.numberOfBUttons = numOfButtons;
        this.buttons.push(false, false, false, false, false, false);
        this.axes.push(this.x, this.y);
        if (this.DEBUG) {
            this.debugPanel = new DebugPanel(this.axes, this.numberOfBUttons);
        }
        for (let i = 1; i <= this.numberOfBUttons; i++) {
            this.buttonEvents.push(new Event('button' + i));
        }
        window.addEventListener("gamepadconnected", (e) => this.onGamePadConnected(e));
    }
    get Left() {
        if (this.x == -1)
            return true;
        return false;
    }
    get Right() {
        if (this.x == 1)
            return true;
        return false;
    }
    get Up() {
        if (this.y == -1)
            return true;
        return false;
    }
    get Down() {
        if (this.y == 1)
            return true;
        return false;
    }
    onGamePadConnected(e) {
        if (this.DEBUG) {
            console.log('Game pad connected');
        }
        this.gamepad = e.gamepad;
        this.previousGamepad = this.gamepad;
        this.isConnected = true;
    }
    update() {
        if (this.isConnected) {
            let gamepads = navigator.getGamepads();
            if (!gamepads) {
                return;
            }
            let gamepad = gamepads[0];
            for (let index = 0; index < this.buttons.length; index++) {
                if (this.buttonPressed(gamepad.buttons[index]) &&
                    !this.buttonPressed(this.previousGamepad.buttons[index])) {
                    document.dispatchEvent(this.buttonEvents[index]);
                    this.buttons[index] = true;
                }
                else {
                    this.buttons[index] = false;
                }
            }
            this.x = Math.round(gamepad.axes[0]);
            this.y = Math.round(gamepad.axes[1]);
            if (this.DEBUG) {
                this.debugPanel.Axes[0] = this.x;
                this.debugPanel.Axes[1] = this.y;
                this.debugPanel.update();
            }
            this.previousGamepad = gamepad;
        }
    }
    buttonPressed(b) {
        if (typeof (b) == "object") {
            return b.pressed;
        }
        return b == 1.0;
    }
}
class Kikker extends GameObject {
    constructor(game) {
        super(game);
        this.speed = 4;
        this.left = false;
        this.right = false;
        this.audioFiles = [
            "audio/apples.m4a",
            "audio/laugh1.m4a",
            "audio/yam.m4a",
            "audio/laugh2.m4a",
            "audio/laugh3.m4a"
        ];
        this.x = 700;
        this.y = 741 - 269;
        this.draw();
        this.boundingRect = document.createElement('div');
        this.boundingRect.classList.add('bounding');
        this.appendChild(this.boundingRect);
        this.sound = document.getElementsByTagName("audio")[0];
        this.sound.src = this.audioFiles[0];
        this.sound.play();
    }
    set Left(value) { this.left = value; }
    set Right(value) { this.right = value; }
    getRectangle() { return this.boundingRect.getBoundingClientRect(); }
    update() {
        super.update();
        if (this.left) {
            this.x -= this.speed;
        }
        if (this.right) {
            this.x += this.speed;
        }
    }
    onCollision() {
        let index = Math.floor((Math.random() * (this.audioFiles.length - 1)) + 1);
        this.sound.src = this.audioFiles[index];
        this.sound.play();
    }
}
window.customElements.define("kikker-component", Kikker);
const template = document.createElement('template');
template.innerHTML = `
<style>
// :host {
//     position:           absolute;
//     top:                10px;
//     right:              10px;
// }
root {
    top:                10px;
    right:              10px;
    width:              289px; 
    height:             120px;
    display:            block;
    background-color: brown;
}

root * {
    position:           relative;
}

.button-wrapper, .axes-wrapper {
    display:            flex;
    flex-wrap:          wrap;
    float:              left;
}

root .button-div {
    border: solid 1px black;
    width:              60px;
    margin:             5px;
    padding:            5px;
}

.button-wrapper {
    width:              164px;
}

.axes-wrapper {
    width:              115px;
    margin:             5px;
}

.axes-cell {
    width:              25px;  
    height:             25px; 
    margin:             5px;  
    border:             solid 1px transparent;
}

.axes-cell.direction {
    border:             solid 1px black;
}

.axes-cell.center{
    border:             solid 1px black;
    background-color: blue;
}
.axes-cell.active{
    background-color: red;
}
</style>`;
class DebugPanel extends HTMLElement {
    constructor(axes, numOfButtons) {
        super();
        this.buttonDivs = [];
        console.log('Debug panel initialized');
        this.numberOfButtons = numOfButtons;
        this.rootElement = document.createElement('root');
        template.appendChild(this.rootElement);
        this.Axes = axes;
        this.createHTMLForAxes();
        this.createHTMLForButtons();
        this.createListenersForButtons();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            let temp = template.content.cloneNode(true);
            temp.appendChild(this.rootElement);
            this.shadowRoot.appendChild(temp);
        }
        document.body.append(this);
    }
    createListenersForButtons() {
        document.addEventListener("button1", (e) => this.handleButtonClicks(e));
        document.addEventListener("button2", (e) => this.handleButtonClicks(e));
        document.addEventListener("button3", (e) => this.handleButtonClicks(e));
        document.addEventListener("button4", (e) => this.handleButtonClicks(e));
        document.addEventListener("button5", (e) => this.handleButtonClicks(e));
        document.addEventListener("button6", (e) => this.handleButtonClicks(e));
    }
    handleButtonClicks(event) {
        let buttonIndex = parseInt(event.type.split('button')[1]);
        let arrayIndex = buttonIndex - 1;
        this.buttonDivs[arrayIndex].style.filter =
            'hue-rotate(' + (Math.random() * 360) + 'deg)';
    }
    createHTMLForButtons() {
        let buttonWrapper = document.createElement("div");
        buttonWrapper.className = "button-wrapper";
        for (let index = 0; index < this.numberOfButtons; index++) {
            let buttonDiv = document.createElement("div");
            buttonDiv.className = "button-div";
            buttonWrapper.appendChild(buttonDiv);
            buttonDiv.style.backgroundColor = "blue";
            buttonDiv.innerHTML = "Button " + (index + 1);
            this.buttonDivs.push(buttonDiv);
        }
        this.rootElement.appendChild(buttonWrapper);
    }
    createHTMLForAxes() {
        let axesWrapper = document.createElement("div");
        axesWrapper.className = "axes-wrapper";
        for (let i = 1; i <= 9; i++) {
            let cell = document.createElement('div');
            cell.className = "axes-cell";
            if (i % 2 == 0)
                cell.classList.add("direction");
            if (i == 5)
                cell.classList.add("center");
            axesWrapper.appendChild(cell);
            switch (i) {
                case 2:
                    this.up = cell;
                    break;
                case 4:
                    this.left = cell;
                    break;
                case 6:
                    this.right = cell;
                    break;
                case 8:
                    this.down = cell;
                    break;
            }
        }
        this.rootElement.appendChild(axesWrapper);
    }
    update() {
        if (this.Axes[0] == 0) {
            this.left.classList.remove("active");
            this.right.classList.remove("active");
        }
        else {
            if (this.Axes[0] < 0)
                this.left.classList.add("active");
            else if (this.Axes[0] > 0)
                this.right.classList.add("active");
        }
        if (this.Axes[1] == 0) {
            this.up.classList.remove("active");
            this.down.classList.remove("active");
        }
        else {
            if (this.Axes[1] < 0)
                this.up.classList.add("active");
            else if (this.Axes[1] > 0)
                this.down.classList.add("active");
        }
    }
}
window.customElements.define("debug-panel", DebugPanel);
//# sourceMappingURL=main.js.map