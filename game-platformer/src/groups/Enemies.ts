import Phaser from "phaser";
import collidable from "../mixins/collidable";
import { ENEMY_TYPES } from "../types";

export default class Enemies extends Phaser.GameObjects.Group {
    [key: string]: any;
    constructor(scene: Phaser.Scene) {
        super(scene);

        Object.assign(this, collidable);
    }

    public getTypes() {
        return ENEMY_TYPES;
    }
}
