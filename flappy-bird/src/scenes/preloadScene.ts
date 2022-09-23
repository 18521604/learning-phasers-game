/** @type {Phaser.Scene} */

import Phaser from "phaser";
import { ObjectImages as ImagesScene } from "../enum/objects";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        // this.load.setBaseURL("http://172.27.57.191:5501/flappy-bird");
        this.load.image(ImagesScene.Sky, "assets/sky-2.png");
        this.load.image(ImagesScene.Cloud, "assets/cloud-2.png");
        this.load.spritesheet(ImagesScene.Bird, "assets/birdSprite.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.image(ImagesScene.Pipe, "assets/pipe-3.png");
        this.load.image(ImagesScene.Pause, "assets/pause.png");
        this.load.image(ImagesScene.Back, "assets/back.png");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
