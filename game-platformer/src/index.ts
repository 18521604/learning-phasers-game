import Phaser from "phaser";
import PlayScene from "./scenes/Play";

let game: any;

window.onload = function () {
    const WIDTH = 1280;
    const HEIGHT = 600;
    const SHARED_CONFIG = {
        width: WIDTH,
        height: HEIGHT,
    };

    const scenes = [PlayScene];
    const createScene = (scene: any) => new scene(SHARED_CONFIG);
    const initScenes = scenes.map(createScene);

    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        ...SHARED_CONFIG,
        physics: {
            default: "arcade",
            arcade: {
                // debug: true,
            },
        },
        scene: initScenes,
    };

    game = new Phaser.Game(config);
};
