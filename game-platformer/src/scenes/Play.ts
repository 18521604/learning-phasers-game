/** @type {Phaser.Scene} */

import Phaser from "phaser";
import Player from "../entities/Player";

export default class Play extends Phaser.Scene {
    // private player: Phaser.Physics.Arcade.Sprite;
    constructor() {
        super("PlayScene");
    }

    create() {
        const map = this.createMap();
        const layers = this.createLayer(map);
        const player = this.createPlayer();

        player.addCollider(layers.platformsColliders);
    }

    createMap() {
        const map = this.make.tilemap({ key: "map" });
        map.addTilesetImage("main_lev_build_1", "tiles-1");
        return map;
    }

    createLayer(map: any) {
        const tileset = map.getTileset("main_lev_build_1");
        const platformsColliders = map.createStaticLayer(
            "platforms_colliders",
            tileset
        );
        const environment = map.createStaticLayer("environment", tileset);
        const platforms = map.createStaticLayer("platforms", tileset);

        //Set collision
        platformsColliders.setCollisionByProperty({ collides: true });

        return { environment, platforms, platformsColliders };
    }

    createPlayer() {
        return new Player(this, 100, 200);
    }
}
