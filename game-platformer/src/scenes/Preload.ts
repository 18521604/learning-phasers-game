import Phaser from "phaser";

export default class Preload extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        this.load.setBaseURL("http://172.27.57.191:5501/game-platformer");
        this.load.tilemapTiledJSON("map", "assets/crystal_world_map.json");
        this.load.image("tiles-1", "assets/main_lev_build_1.png");
        this.load.image("tiles-2", "assets/main_lev_build_2.png");
        // this.load.image("player", "assets/player/movements/idle01.png");
        this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
            frameWidth: 32,
            frameHeight: 38,
            spacing: 32,
        });
    }

    create() {
        this.scene.start("PlayScene");
    }
}