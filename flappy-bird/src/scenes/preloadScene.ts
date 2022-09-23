/** @type {Phaser.Scene} */

import Phaser from "phaser";
import { ObjectImages as ImagesScene } from "../enum/objects";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        // this.load.setBaseURL("http://172.27.57.191:5501/flappy-bird");
        this.load.setBaseURL(
            "https://hi-static.fpt.vn/sys/hifpt/pnc_pdx/game-demo/flappy-bird"
        );
        this.load.image(ImagesScene.Sky, "sky-2.png");
        this.load.image(ImagesScene.Cloud, "cloud-2.png");
        this.load.spritesheet(ImagesScene.Bird, "birdSprite.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.image(ImagesScene.Pipe, "pipe-3.png");
        this.load.image(ImagesScene.Pause, "pause.png");
        this.load.image(ImagesScene.Back, "back.png");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
