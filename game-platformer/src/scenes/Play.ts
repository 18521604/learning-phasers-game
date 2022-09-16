/** @type {Phaser.Scene} */

import Phaser from "phaser";

export default class Play extends Phaser.Scene {
    constructor() {
        super("PlayScene");
    }

    preload() {
        this.load.setBaseURL("http://172.27.57.191:5501/game-platformer");
        this.load.image("sky", "assets/sky.png");
    }

    create() {
        this.add.image(0, 0, "sky").setOrigin(0);
    }

    update() {}
}
