import Phaser from "phaser";
import { listObjects } from "../enum";
import initAminations from "./playerAnims";

import collidable from "../mixins/collidable";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    [key: string]: any;
    private gravity: number;
    private speed: number;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    scene: Phaser.Scene;

    private jumpCount: number;
    private consecutiveJump: number;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, listObjects.Player);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        //Mixins
        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    }

    private init() {
        this.jumpCount = 0;
        this.consecutiveJump = 1;
        this.gravity = 500;
        this.speed = 150;

        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);

        initAminations(this.scene.anims);
    }

    private initEvents() {
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    public update(): void {
        const { left, right, space } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space!);
        // @ts-ignore
        const onFloor = this.body.onFloor();

        if (left!.isDown) {
            this.setFlipX(true);
            this.setVelocityX(-this.speed);
        } else if (right!.isDown) {
            this.setFlipX(false);
            this.setVelocityX(this.speed);
        } else {
            this.setVelocityX(0);
        }

        if (
            isSpaceJustDown &&
            (onFloor || this.jumpCount < this.consecutiveJump)
        ) {
            this.setVelocityY(-this.speed * 2);
            this.jumpCount++;
        }

        if (onFloor) {
            this.jumpCount = 0;
        }

        onFloor
            ? this.body.velocity.x === 0
                ? this.play("idle", true)
                : this.play("run", true)
            : this.play("jump", true);
    }
}
