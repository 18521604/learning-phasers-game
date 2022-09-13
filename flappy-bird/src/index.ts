import Phaser from "phaser";
import { GameScene } from "./gameScene";

let game: any;
window.onload = function () {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 2000,
        height: 600,
        scene: [GameScene],
        physics: {
            default: "arcade",
            arcade: { debug: true },
        },
    };

    game = new Phaser.Game(config);
};
