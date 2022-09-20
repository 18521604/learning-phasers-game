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
    cloud: any;
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

    //Level
    level: any = 1;
    bestLevel: any;
    listLevels = {
        1: {
            pipeHorizontalDistanceRange: [400, 500],
            pipeVerticalDistanceRange: [250, 350],
            pipeVelocity: 200,
        },
        2: {
            pipeHorizontalDistanceRange: [360, 460],
            pipeVerticalDistanceRange: [210, 310],
            pipeVelocity: 250,
        },
        3: {
            pipeHorizontalDistanceRange: [340, 440],
            pipeVerticalDistanceRange: [180, 270],
            pipeVelocity: 330,
        },
        4: {
            pipeHorizontalDistanceRange: [320, 400],
            pipeVerticalDistanceRange: [180, 250],
            pipeVelocity: 360,
        },
        5: {
            pipeHorizontalDistanceRange: [300, 380],
            pipeVerticalDistanceRange: [180, 230],
            pipeVelocity: 400,
        },
    };

    constructor(config: any) {
        super("GameScene", config);

        this.config = config;

        this.flapVelocity = 600;

        this.score = 0;
    }

    create() {
        this.level = 1;
        super.create();
        this.createCloud();
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
        this.updatePositionCloud();
    }

    createBackground() {
        this.sky = this.add.image(0, 0, ImagesScene.Sky);
        this.sky.setOrigin(0, 0);
    }

    createBirds() {
        this.bird = this.physics.add
            .sprite(
                this.config.birdPosition.x,
                this.config.birdPosition.y,
                ImagesScene.Bird
            )
            .setFlipX(true)
            .setScale(5);
        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
        this.bird.body.gravity.y = 2000;
        this.bird.setCollideWorldBounds(true);
    }

    createCloud() {
        this.cloud = this.add.tileSprite(
            0,
            100,
            this.config.width,
            500,
            ImagesScene.Cloud
        );
        this.cloud.setOrigin(0);
    }

    updatePositionCloud() {
        this.cloud.tilePositionX += 1;
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
            .setScale(5)
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
        this.bestScore = localStorage.getItem("bestScore");
        this.bestLevel = localStorage.getItem("bestLevel");
        this.scoreText = this.add.text(
            16,
            16,
            `Score: ${this.score}/ Best score: ${this.bestScore || 0}\nLevel: ${
                this.level
            }/ Best Level: ${this.bestLevel || 1}`,
            {
                font: "32px Arial",
                lineSpacing: 10,
                color: "#67EF75",
            }
        );

        this.scoreText.depth = 5;
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

    saveBestScoreAndLevel() {
        this.bestScore = Number(localStorage.getItem("bestScore"));
        if (!this.bestScore || this.score > this.bestScore) {
            localStorage.setItem("bestScore", this.score);
        }

        //Save best level
        this.bestLevel = Number(localStorage.getItem("bestLevel"));
        if (!this.bestLevel || this.level > this.bestLevel) {
            localStorage.setItem("bestLevel", this.level);
        }
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0x732335);
        this.score = 0;
        this.saveBestScoreAndLevel();

        this.add
            .text(
                this.screenCenter[0],
                this.screenCenter[1],
                "GAME OVER!",
                this.fontOptions
            )
            .setOrigin(0.5);
        this.cameras.main.shake(1000, 0.005);
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.start("MenuScene");
            },
            loop: false,
        });
    }

    placePipe() {
        const tempLevel = this.listLevels[this.level];
        const pipeRightMostX = this.getPipeRightMostX();
        const pipeVerticalDistance = Phaser.Math.Between(
            tempLevel.pipeVerticalDistanceRange[0],
            tempLevel.pipeVerticalDistanceRange[1]
        );
        const pipeVerticalPosition = Phaser.Math.Between(
            0 + 300,
            Number(this.config.height) - 300 - pipeVerticalDistance
        );
        const pipeHorizontalDistance = Phaser.Math.Between(
            tempLevel.pipeHorizontalDistanceRange[0],
            tempLevel.pipeHorizontalDistanceRange[1]
        );
        const upperPipe = this.pipesGroup
            .create(
                pipeRightMostX + pipeHorizontalDistance,
                pipeVerticalPosition,
                ImagesScene.Pipe
            )
            .setFlipY(true)
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

        upperPipe.setBodySize(upperPipe.width - 4, upperPipe.height);
        lowerPipe.setBodySize(lowerPipe.width - 4, lowerPipe.height);
        this.pipesGroup.setVelocityX(-tempLevel.pipeVelocity);
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
            if (pipe.getBounds().left <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.pipesGroup.getChildren().splice(0, 2);
                    this.placePipe();
                    this.increaseScore();
                    this.increaseLevel();
                }
            }
        });
    }

    increaseScore() {
        this.score++;
        this.scoreText.destroy();
        this.saveBestScoreAndLevel();
        this.createScore();
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
                    { font: "80px Arial" }
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

    increaseLevel() {
        switch (this.score) {
            case 10:
                this.level = 2;
                break;
            case 50:
                this.level = 3;
                break;
            case 100:
                this.level = 4;
                break;
            case 150:
                this.level = 5;
                break;
            default:
                break;
        }
    }
}
