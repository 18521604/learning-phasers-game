/** @type {Phaser.Scene} */

import { BaseScene } from "./baseScene";

export class PauseScene extends BaseScene {
    private menu: Array<object>;
    constructor(config: any) {
        super("PauseScene", config);
        this.menu = [
            { scene: "GameScene", text: "Continue" },
            { scene: "MenuScene", text: "Exit" },
        ];
    }

    create() {
        super.create();

        this.createMenu(this.menu, this.setUpMenuEvents.bind(this));
    }

    setUpMenuEvents(menuItem: object) {
        const textGameObj = menuItem["textGameObj"];
        textGameObj.setInteractive();

        textGameObj.on("pointerover", () => {
            textGameObj.setStyle({ fill: "#CD00FF" });
        });
        textGameObj.on("pointerout", () => {
            textGameObj.setStyle({ fill: "#fff" });
        });
        textGameObj.on("pointerup", () => {
            if (menuItem["scene"] && menuItem["text"] === "Continue") {
                this.scene.stop();
                this.scene.resume(menuItem["scene"]);
            } else {
                this.scene.stop("GameScene");
                this.scene.start(menuItem["scene"]);
            }
        });
    }
}
