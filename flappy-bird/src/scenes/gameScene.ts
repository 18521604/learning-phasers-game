/** @type {Phaser.Scene} */

import { ObjectImages as ImagesScene } from "../enum/objects";
import { BaseScene } from "./baseScene";

const VELOCITY = 10;
const ACCELERATION = 100;
const PIPES_TO_RENDER = 4;

export class GameScene extends BaseScene {
    //Objects constructor
    bird: any;
    sky: any;
    pauseButton: any;
    isPaused: any;

    //Score constructor
    score: any;
    scoreText: any;
    bestScore: any;
    bestScoreText: any;

    pipesGroup: any;
    flapVelocity: any;

    //CountDown
    initialTime: any;
    countDownText: any;
    timeEvent: any;
    pauseEvent: any;

    //difficulty
    currentDifficulty: any = "easy";
    listDifficulties = {
        easy: {
            pipeHorizontalDistanceRange: [400, 500],
            pipeVerticalDistanceRange: [150, 200],
        },
        normal: {
            pipeHorizontalDistanceRange: [280, 330],
            pipeVerticalDistanceRange: [140, 190],
        },
        hard: {
            pipeHorizontalDistanceRange: [250, 310],
            pipeVerticalDistanceRange: [130, 180],
        },
    };

    constructor(config: any) {
        super("GameScene", config);

        this.config = config;

        this.flapVelocity = 300;

        this.score = 0;
    }

    create() {
        this.currentDifficulty = "easy";
        super.create();
        this.createBirds();
        this.createPipes();
        this.createPause();
        this.createScore();
        this.handleInputs();
        this.createColliders();
        this.listenToEvents();

        this.anims.create({
            key: "fly",
            frames: this.anims.generateFrameNumbers("bird", {
                start: 8,
                end: 15,
            }),
            frameRate: 8,
            repeat: -1,
        });

        this.bird.play("fly");
    }

    update(time: number, delta: number): void {
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBackground() {
        this.sky = this.add.image(0, 0, ImagesScene.Sky);
        this.sky.setOrigin(0, 0);
        this.sky.displayWidth = Number(this.config.width);
        this.sky.displayHeight = Number(this.config.height);
    }

    createBirds() {
        this.bird = this.physics.add
            .sprite(
                this.config.birdPosition.x,
                this.config.birdPosition.y,
                ImagesScene.Bird
            )
            .setFlipX(true)
            .setScale(3);
        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
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

        this.pauseButton.on("pointerup", () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch("PauseScene");
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
        this.input.on("pointerup", this.flapBird, this);
        this.input.keyboard.on("keydown-SPACE", this.flapBird, this);
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
            this.bird.getBounds().bottom >= this.config.height ||
            this.bird.getBounds().top <= 0
        ) {
            this.gameOver();
        }
    }

    flapBird() {
        if (this.isPaused) {
            return;
        }
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

        this.add.text(
            this.screenCenter[0],
            this.screenCenter[1],
            "GAME OVER!",
            this.fontOptions
        );

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                // this.scene.restart();
                this.scene.start("MenuScene");
            },
            loop: false,
        });
    }

    placePipe() {
        const difficulty = this.listDifficulties[this.currentDifficulty];
        const pipeRightMostX = this.getPipeRightMostX();
        const pipeVerticalDistance = Phaser.Math.Between(
            difficulty.pipeVerticalDistanceRange[0],
            difficulty.pipeVerticalDistanceRange[1]
        );
        const pipeVerticalPosition = Phaser.Math.Between(
            0 + 20,
            Number(this.config.height) - 20 - pipeVerticalDistance
        );
        const pipeHorizontalDistance = Phaser.Math.Between(
            difficulty.pipeHorizontalDistanceRange[0],
            difficulty.pipeHorizontalDistanceRange[1]
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
                    this.increaseDifficult();
                }
            }
        });
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    //listen event when resume
    listenToEvents() {
        if (this.pauseEvent) {
            return;
        }

        this.pauseEvent = this.events.on("resume", () => {
            this.initialTime = 3;
            this.countDownText = this.add
                .text(
                    this.screenCenter[0],
                    this.screenCenter[1],
                    this.initialTime.toString(),
                    this.fontOptions
                )
                .setOrigin(0.5);
            this.timeEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true,
            });
        });
    }

    countDown() {
        this.initialTime--;
        this.countDownText.setText(this.initialTime);
        if (this.initialTime <= 0) {
            this.isPaused = false;
            this.countDownText.setText("");
            this.physics.resume();
            this.timeEvent.remove();
        }
    }

    increaseDifficult() {
        if (this.score === 1) {
            this.currentDifficulty = "normal";
        }

        if (this.score === 3) {
            this.currentDifficulty = "hard";
        }
    }
}
