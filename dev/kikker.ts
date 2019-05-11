/// <reference path="gameobject.ts" />

class Kikker extends GameObject {

    private speed : number = 4

    private left : boolean = false
    private right : boolean = false

    private sound : HTMLAudioElement

    public set Left(value : boolean)    { this.left     = value }
    public set Right(value : boolean)   { this.right    = value }   

    private audioFiles = [
        "audio/apples.m4a",
        "audio/laugh1.m4a",
        "audio/yam.m4a",
        "audio/laugh2.m4a",
        "audio/laugh3.m4a"
    ];

    constructor(game:Element) {
        super(game)

        this.x = 700
        this.y = 741 - 269
        this.draw()

        // we start preloading all the audio files
        // for (let i in this.audioFiles) {
        //     this.preloadAudio(this.audioFiles[i]);
        // }

        this.sound = document.getElementsByTagName("audio")[0]
        this.sound.src = this.audioFiles[0]
        this.sound.play()
        
        this.sound.addEventListener("ended", () => { document.dispatchEvent(new Event('init')) })

        // var audio = new Audio('audio/apples.m4a');
        // audio.play();
    }

    public update() {
        super.update()

        if(this.left) {
            this.x -= this.speed
        }
        if(this.right) {
            this.x += this.speed
        }
    }

    public onCollision() {
        // skip first audio file, this is the opening sound
        let index = Math.floor((Math.random() * (this.audioFiles.length - 1)) + 1)
        this.sound.src = this.audioFiles[index]
        this.sound.play()
    }
}

window.customElements.define("kikker-component", Kikker);