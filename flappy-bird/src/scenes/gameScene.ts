/** @type {Phaser.Scene} */

import Phaser from "phaser";
import { ObjectImages as ImagesScene } from "../enum/objects";

const VELOCITY = 10;
const ACCELERATION = 100;
const PIPES_TO_RENDER = 4;

export class GameScene extends Phaser.Scene {
    //config constructor
    config: any;

    //Objects constructor
    bird: any;
    sky: any;
    pauseButton: any;

    //Score constructor
    score: any;
    scoreText: any;
    bestScore: any;
    bestScoreText: any;

    pipesGroup: any;
    pipeVerticalDistanceRange: any;
    pipeHorizontalDistanceRange: any;
    flapVelocity: any;

    constructor(config: any) {
        super("GameScene");

        this.config = config;

        this.flapVelocity = 300;
        this.pipeVerticalDistanceRange = [130, 200];
        this.pipeHorizontalDistanceRange = [400, 600];

        this.score = 0;
    }

    create() {
        this.createBackground();
        this.createBirds();
        this.createPipes();
        this.createPause();
        this.createScore();
        this.handleInputs();
        this.createColliders();
    }

    update(time: number, delta: number): void {
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBackground() {
        this.sky = this.add.image(0, 0, ImagesScene.Sky);
        this.sky.setOrigin(0, 0);
        this.sky.displayWidth = Number(this.game.config.width);
        this.sky.displayHeight = Number(this.game.config.height);
    }

    createBirds() {
        this.bird = this.physics.add.sprite(
            this.config.birdPosition.x,
            this.config.birdPosition.y,
            ImagesScene.Bird
        );
        this.bird.body.gravity.y = 400;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.pipesGroup = this.physics.add.group();
        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            this.placePipe();
        }
    }

    createPause() {
        this.pauseButton = this.add
            .image(
                this.config.width - 10,
                this.config.height - 10,
                ImagesScene.Pause
            )
            .setScale(3)
            .setOrigin(1);
        this.pauseButton.depth = 5;
        this.pauseButton.setInteractive(); 

        this.pauseButton.on("pointerdown", () => {
            this.physics.pause();
            this.scene.pause();
        });
    }

    createScore() {
        this.score = 0;
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, {
            fontSize: "32px",
        });

        this.bestScore = localStorage.getItem("bestScore");
        this.bestScoreText = this.add.text(
            16,
            50,
            `Record: ${this.bestScore || 0}`,
            {
                fontSize: "16px",
            }
        );

        this.scoreText.depth = this.bestScoreText.depth = 5;
    }

    handleInputs() {
        this.input.on("pointerdown", this.flapBird, this);
        this.input.keyboard.on("keydown_SPACE", this.flapBird, this);
    }

    createColliders() {
        this.physics.add.collider(
            this.bird,
            this.pipesGroup,
            this.gameOver,
            undefined,
            this
        );
    }

    checkGameStatus() {
        if (
            this.bird.getBounds().bottom >= this.game.config.height ||
            this.bird.getBounds().top <= 0
        ) {
            this.gameOver();
        }
    }

    flapBird() {
        this.bird.body.velocity.y = -this.flapVelocity;
    }

    saveBestScore() {
        this.bestScore = Number(localStorage.getItem("bestScore"));
        if (!this.bestScore || this.score > this.bestScore) {
            localStorage.setItem("bestScore", this.score);
        }
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0x732335);

        this.saveBestScore();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false,
        });
    }

    placePipe() {
        const pipeRightMostX = this.getPipeRightMostX();
        const pipeVerticalDistance = Phaser.Math.Between(
            this.pipeVerticalDistanceRange[0],
            this.pipeVerticalDistanceRange[1]
        );
        const pipeVerticalPosition = Phaser.Math.Between(
            0 + 20,
            Number(this.config.height) - 20 - pipeVerticalDistance
        );
        const pipeHorizontalDistance = Phaser.Math.Between(
            this.pipeHorizontalDistanceRange[0],
            this.pipeHorizontalDistanceRange[1]
        );

        const upperPipe = this.pipesGroup
            .create(
                pipeRightMostX + pipeHorizontalDistance,
                pipeVerticalPosition,
                ImagesScene.Pipe
            )
            .setImmovable(true)
            .setOrigin(0, 1);
        const lowerPipe = this.pipesGroup
            .create(
                upperPipe.x,
                upperPipe.y + pipeVerticalDistance,
                ImagesScene.Pipe
            )
            .setImmovable(true)
            .setOrigin(0);
        this.pipesGroup.setVelocityX(-200);
    }

    getPipeRightMostX() {
        let rightMostX = 0;
        this.pipesGroup.getChildren().forEach((pipe: any) => {
            rightMostX = Math.max(pipe.x, rightMostX);
        });
        return rightMostX;
    }

    recyclePipes() {
        let tempPipes: any = [];
        this.pipesGroup.getChildren().forEach((pipe: any) => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.pipesGroup.getChildren().splice(0, 2);
                    this.placePipe();
                    this.increaseScore();
                    this.saveBestScore();
                }
            }
        });
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}
