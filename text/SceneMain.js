/** @type {Phaser.Scene} */

class SceneMain extends Phaser.Scene {
    constructor() {
        super("SceneMain");
    }

    preload() {
        this.load.setBaseURL(window.location.origin);

        this.load.spritesheet("bee", "../../assets/bee-sprite.png", {
            frameWidth: 150,
            frameHeight: 173,
        });
    }

    create() {
        this.text = this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            "Hello!"
        );
        this.text.setOrigin(0.5, 0.5);

        const frameNumbers = this.anims.generateFrameNumbers("bee");

        this.anims.create({
            key: "fly",
            frames: frameNumbers,
            frameRate: 8,
            repeat: -1,
        });

        this.bee.play("fly");
        this.doFly();

        //Text
    }

    doFly() {
        this.tweens.add({
            targets: this.bee,
            duration: 1000,
            x: game.config.width - this.bee.width / 2,
            y: this.bee.height / 2,
            alpha: 0.5,
            onComplete: this.completedHandler.bind(this),
        });
    }

    completedHandler(tween, targets, scope) {
        var bee = targets[0];
        bee.x = 0;
        bee.y = game.config.height / 2;
        bee.alpha = 1;
        this.doFly();
    }

    update() {}
}
