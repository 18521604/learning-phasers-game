/** @type {Phaser.Scene} */

import Phaser from "phaser";
import { ObjectImages as ImagesScene } from "../enum/objects";

export class BaseScene extends Phaser.Scene {
    protected config: any;
    sky: any;
    protected screenCenter: Array<number>;
    protected fontOptions: object;
    private fontSize: number;
    private lineHeight: number;

    constructor(key: any, config: any) {
        super(key);
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2];
        this.fontSize = 32;
        this.lineHeight = 42;
        this.fontOptions = {
            fontSize: `${this.fontSize}px`,
            fill: "#fff",
        };
    }

    create() {
        this.createBackground();
    }

    createBackground() {
        this.sky = this.add.image(0, 0, ImagesScene.Sky);
        this.sky.setOrigin(0, 0);
        this.sky.displayWidth = Number(this.config.width);
        this.sky.displayHeight = Number(this.config.height);
    }

    createMenu(menu: Array<object>, setupMenuEvents: any) {
        let lastMenuPositionY: number = 0;

        menu.forEach((menuItem: object) => {
            const menuPossition = [
                this.screenCenter[0],
                this.screenCenter[1] + lastMenuPositionY,
            ];
            menuItem["textGameObj"] = this.add
                .text(
                    menuPossition[0],
                    menuPossition[1],
                    menuItem["text"],
                    this.fontOptions
                )
                .setOrigin(0.5, 2);
            lastMenuPositionY += this.lineHeight;
            setupMenuEvents(menuItem);
        });
    }

    protected createBackButton() {
        const backButton = this.add
            .image(
                this.config.width - 10,
                this.config.height - 10,
                ImagesScene.Back
            )
            .setOrigin(1)
            .setScale(2)
            .setInteractive();

        backButton.on("pointerup", () => {
            this.scene.start("MenuScene");
        });
    }
}
