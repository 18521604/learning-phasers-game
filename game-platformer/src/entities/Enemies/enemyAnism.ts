import { listEntities } from "../../types";

export default (anism: Phaser.Animations.AnimationManager) => {
    anism.create({
        key: "birdman-idle",
        frames: anism.generateFrameNumbers(listEntities.Birdman, {
            start: 0,
            end: 12,
        }),
        frameRate: 8,
        repeat: -1,
    });
};
