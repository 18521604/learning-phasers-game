import Phaser from "phaser";
import { BestScoreScene } from "./scenes/bestScoreScene";
import { GameScene } from "./scenes/gameScene";
import { MenuScene } from "./scenes/menuScene";
import { PreloadScene } from "./scenes/preloadScene";

let game: any;

window.onload = function () {
    const WIDTH = window.innerWidth;
    const HEIGHT = 600;
    const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };
    const SHARED_CONFIG = {
        width: WIDTH,
        height: HEIGHT,
        birdPosition: BIRD_POSITION,
    };

    const scenes = [PreloadScene, MenuScene, BestScoreScene, GameScene];
    const createScene = (scene: any) => new scene(SHARED_CONFIG);
    const initScenes = scenes.map(createScene);

    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        ...SHARED_CONFIG,
        physics: {
            default: "arcade",
            arcade: { debug: true },
        },
        scene: initScenes,
    };

    game = new Phaser.Game(config);
};
