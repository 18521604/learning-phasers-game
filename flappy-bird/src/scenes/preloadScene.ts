/** @type {Phaser.Scene} */

import Phaser from "phaser";
import { ObjectImages as ImagesScene } from "../enum/objects";

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        this.load.setBaseURL("http://127.0.0.1:5501/flappy-bird");
        this.load.image(ImagesScene.Sky, "assets/sky.png");
        this.load.image(ImagesScene.Bird, "assets/bird.png");
        this.load.image(ImagesScene.Pipe, "assets/pipe.png");
        this.load.image(ImagesScene.Pause, "assets/pause.png");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
