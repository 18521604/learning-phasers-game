import { listEntities } from "../types";

export default (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: "idle",
        frames: anims.generateFrameNumbers(listEntities.Player, {
            start: 0,
            end: 8,
        }),
        frameRate: 8,
        repeat: -1,
    });
    anims.create({
        key: "run",
        frames: anims.generateFrameNumbers(listEntities.Player, {
            start: 11,
            end: 16,
        }),
        frameRate: 8,
        repeat: -1,
    });
    anims.create({
        key: "jump",
        frames: anims.generateFrameNumbers(listEntities.Player, {
            start: 17,
            end: 23,
        }),
        frameRate: 5,
        repeat: -1,
    });
};
