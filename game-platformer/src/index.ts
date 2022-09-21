import Phaser from "phaser";
import PlayScene from "./scenes/Play";
import Preload from "./scenes/Preload";

let game: any;

window.onload = function () {
    const MAP_WIDTH = 1600;

    const WIDTH = document.body.offsetWidth;
    const HEIGHT = 640;
    const SHARED_CONFIG = {
        mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
        width: WIDTH,
        height: HEIGHT,
        zoomFactor: 1.5,
    };

    const scenes = [Preload, PlayScene];
    const createScene = (scene: any) => new scene(SHARED_CONFIG);
    const initScenes = scenes.map(createScene);

    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        ...SHARED_CONFIG,
        physics: {
            default: "arcade",
            arcade: {
                debug: true,
            },
        },
        scene: initScenes,
    };

    game = new Phaser.Game(config);
};
