import Phaser from "phaser";
import { listEntities } from "../types";

export default class Preload extends Phaser.Scene {
    constructor() {
        super("PreloadScene");
    }

    preload() {
        this.load.setBaseURL("http://172.27.57.191:5501/game-platformer");
        this.load.tilemapTiledJSON("map", "assets/crystal_world_map.json");
        this.load.image("tiles-1", "assets/main_lev_build_1.png");
        this.load.image("tiles-2", "assets/main_lev_build_2.png");
        this.load.spritesheet(
            listEntities.Player,
            "assets/player/move_sprite_1.png",
            {
                frameWidth: 32,
                frameHeight: 38,
                spacing: 32,
            }
        );
        this.load.spritesheet(
            listEntities.Birdman,
            "assets/enemy/enemy_sheet.png",
            {
                frameWidth: 50,
                frameHeight: 64,
                spacing: 14,
            }
        );
    }

    create() {
        this.scene.start("PlayScene");
    }
}
