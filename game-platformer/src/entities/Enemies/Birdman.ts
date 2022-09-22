import { listEntities } from "../../types";
import Enemy from "./Enemy";
import initAnism from "../Enemies/enemyAnism";

export default class Birdman extends Enemy {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, listEntities.Birdman);
        initAnism(scene.anims);
    }

    update() {
        super.update();
        this.play("birdman-idle", true);
    }
}
