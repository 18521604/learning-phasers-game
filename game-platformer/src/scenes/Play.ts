/** @type {Phaser.Scene} */

import Phaser from "phaser";
import Player from "../entities/Player";

export default class Play extends Phaser.Scene {
    private config: any;
    constructor(config: any) {
        super("PlayScene");
        this.config = config;
    }

    create() {
        const map = this.createMap();
        const layers = this.createLayer(map);
        const player = this.createPlayer();

        this.createPlayerColliders(player, {
            colliders: { platformsColliders: layers.platformsColliders },
        });

        this.setupFollowupCameraOn(player);
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

    createPlayerColliders(player: any, { colliders }) {
        player.addCollider(colliders.platformsColliders);
    }

    setupFollowupCameraOn(player: Phaser.Physics.Arcade.Sprite) {
        const { width, height, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
        this.cameras.main
            .setBounds(0, 0, width + mapOffset, height)
            .setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }
}
