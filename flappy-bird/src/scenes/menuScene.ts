/** @type {Phaser.Scene} */

import { BaseScene } from "./baseScene";

export class MenuScene extends BaseScene {
    private menu: Array<object>;
    constructor(config: any) {
        super("MenuScene", config);
        this.menu = [
            { scene: "GameScene", text: "Play" },
            { scene: "BestScoreScene", text: "Score" },
            { scene: null, text: "Exit" },
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
        textGameObj.on("pointerdown", () => {
            this.scene.start(menuItem["scene"]);

            if (menuItem["text"] === "Exit") {
                this.game.destroy(true);
            }
        });
    }
}
