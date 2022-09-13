/** @type {Phaser.Scene} */

import Phaser from "phaser";

enum ImagesScene {
    Sky = "sky",
    Bird = "bird",
    Pipe = "pipe",
}

const VELOCITY = 10;
const ACCELERATION = 100;
const PIPES_TO_RENDER = 4;

const flapVelocity = 300;
let bird: any = null;
let pipeHorizontalDisance = 400;

export class GameScene extends Phaser.Scene {
    config: any;
    initialBirdPosition: any;
    pipeVerticalDistanceRange: any;

    constructor() {
        super("GameScene");
    }

    init() {
        this.config = this.sys.game.config;
        this.initialBirdPosition = {
            x: Number(this.config.width) * 0.1,
            y: Number(this.config.height) / 2,
        };
        this.pipeVerticalDistanceRange = [100, 200];
    }
    preload() {
        this.load.setBaseURL("http://127.0.0.1:5501/flappy-bird");
        this.load.image(ImagesScene.Sky, "assets/sky.png");
        this.load.image(ImagesScene.Bird, "assets/bird.png");
        this.load.image(ImagesScene.Pipe, "assets/pipe.png");
    }

    create() {
        //sky
        let sky = this.add.image(0, 0, ImagesScene.Sky);
        sky.setOrigin(0, 0);
        sky.displayWidth = Number(this.game.config.width);
        sky.displayHeight = Number(this.game.config.height);

        //bird
        bird = this.physics.add.sprite(
            this.initialBirdPosition.x,
            this.initialBirdPosition.y,
            ImagesScene.Bird
        );
        bird.body.gravity.y = 400;

        this.add.text(10, 10, "HELLO WORLD");

        //pipe
        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            this.placePipe();
        }

        //Input
        this.input.on("pointerdown", this.flapBird);

        this.input.keyboard.on("keydown_SPACE", this.flapBird);
    }

    update(time: number, delta: number): void {
        if (bird.y > this.game.config.height || bird.y < -bird.height) {
            // alert("you are lost");
            this.restartBirdPosition();
        }
    }

    flapBird() {
        bird.body.velocity.y = -flapVelocity;
    }

    restartBirdPosition() {
        bird.x = this.initialBirdPosition.x;
        bird.y = this.initialBirdPosition.y;
        bird.body.velocity.y = 0;
    }

    placePipe() {
        pipeHorizontalDisance += 400;

        let pipeVerticalDistance = Phaser.Math.Between(
            this.pipeVerticalDistanceRange[0],
            this.pipeVerticalDistanceRange[1]
        );
        let pipeVerticalPosition = Phaser.Math.Between(
            0 + 20,
            Number(this.config.height) - 20 - pipeVerticalDistance
        );

        const upperPipe = this.physics.add
            .sprite(
                pipeHorizontalDisance,
                pipeVerticalPosition,
                ImagesScene.Pipe
            )
            .setOrigin(0, 1);
        const lowerPipe = this.physics.add
            .sprite(
                pipeHorizontalDisance,
                upperPipe.y + pipeVerticalDistance,
                ImagesScene.Pipe
            )
            .setOrigin(0);

        upperPipe.body.velocity.x = -200;
        lowerPipe.body.velocity.x = -200;
    }
}
