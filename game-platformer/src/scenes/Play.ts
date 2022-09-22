/** @type {Phaser.Scene} */

import Phaser from "phaser";
import Birdman from "../entities/Enemies/Birdman";
import Player from "../entities/Player";
import shared_config from "../Schemas/config";
import Enemies from "../groups/Enemies";
export default class Play extends Phaser.Scene {
    private config: shared_config;
    constructor(config: shared_config) {
        super("PlayScene");
        this.config = config;
    }

    create() {
        const map = this.createMap();
        const layers = this.createLayer(map);
        const playerZones = this.getPlayerZones(layers.playerZones);
        const player = this.createPlayer(playerZones.start!);

        this.createPlayerColliders(player, {
            colliders: { platformsColliders: layers.platformsColliders },
        });

        //create enemies
        const birdmans = this.createEnemy(layers.enemySpawns.objects);
        this.createEnemyColliders(birdmans, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                player,
            },
        });

        this.createEndMap(playerZones.end!, player);
        this.setupFollowupCameraOn(player);
    }

    createMap() {
        const map = this.make.tilemap({ key: "map" });
        map.addTilesetImage("main_lev_build_1", "tiles-1");
        return map;
    }

    createLayer(map: Phaser.Tilemaps.Tilemap) {
        const tileset = map.getTileset("main_lev_build_1");

        //Layer objects
        const platformsColliders = map.createStaticLayer(
            "platforms_colliders",
            tileset
        );
        const environment = map.createStaticLayer("environment", tileset);
        const platforms = map.createStaticLayer("platforms", tileset);

        //Zone
        const playerZones = map.getObjectLayer("player_zones");
        const enemySpawns = map.getObjectLayer("enemy_spawns");

        //Set collision
        platformsColliders.setCollisionByProperty({ collides: true });

        return {
            environment,
            platforms,
            platformsColliders,
            playerZones,
            enemySpawns,
        };
    }

    createPlayer(startZone: Phaser.Types.Tilemaps.TiledObject) {
        return new Player(this, startZone.x!, startZone.y!);
    }

    createPlayerColliders(player: Player, { colliders }) {
        player.addCollider(colliders.platformsColliders);
    }

    createEnemy(spawnLayer: Phaser.Types.Tilemaps.TiledObject[]) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();
        spawnLayer.forEach((spawnPoint) => {
            const enemy = new enemyTypes[spawnPoint.properties[0].value](
                this,
                spawnPoint.x!,
                spawnPoint.y!
            );
            enemies.add(enemy);
        });
        return enemies;
    }

    createEnemyColliders(enemies: Enemies, { colliders }) {
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player);
    }

    setupFollowupCameraOn(player: Player) {
        const { width, height, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
        this.cameras.main
            .setBounds(0, 0, width + mapOffset, height)
            .setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer: Phaser.Tilemaps.ObjectLayer) {
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find((zone) => zone.name === "startZone"),
            end: playerZones.find((zone) => zone.name === "endZone"),
        };
    }

    createEndMap(endZone: Phaser.Types.Tilemaps.TiledObject, player: Player) {
        const endMap = this.physics.add
            .sprite(endZone.x!, endZone.y!, "end")
            .setSize(5, this.config.height)
            .setAlpha(0);
        const eolOverlap = this.physics.add.overlap(player, endMap, () => {
            eolOverlap.active = false;
            console.log("You won!");
        });
    }
}
