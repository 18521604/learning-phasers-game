import Phaser from "phaser";

import collidable from "../../mixins/collidable";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    [x: string]: any;
    private gravity: number;
    private speed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Mixins
        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    }

    protected init() {
        this.gravity = 500;
        this.speed = 150;

        this.setGravityY(this.gravity);
        this.setSize(35, 45);
        this.setOffset(5, 20);
        this.setImmovable(true);
        this.setCollideWorldBounds(true);

        this.setOrigin(0.5, 1);
    }

    initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(): void {}
}
