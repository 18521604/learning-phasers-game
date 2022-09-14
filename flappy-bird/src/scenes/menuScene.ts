/** @type {Phaser.Scene} */

import Phaser from "phaser";
import { ObjectImages as ImagesScene } from "../enum/objects";

export class MenuScene extends Phaser.Scene {
    config: any;
    sky: any;

    constructor(config: any) {
        super("MenuScene");
        this.config = config;
    }

    create() {
        this.createBackground();
        this.scene.start("GameScene");
    }

    createBackground() {
        this.sky = this.add.image(0, 0, ImagesScene.Sky);
        this.sky.setOrigin(0, 0);
        this.sky.displayWidth = Number(this.game.config.width);
        this.sky.displayHeight = Number(this.game.config.height);
    }
}
