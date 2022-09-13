/** @type {Phaser.Scene} */

class SceneMain extends Phaser.Scene {
    constructor() {
        super("SceneMain");
    }

    preload() {
        this.load.setBaseURL("http://labs.phaser.io");

        this.load.image("sky", "assets/skies/space3.png");
        this.load.image("logo", "assets/sprites/phaser1.png");
        this.load.image("red", "assets/particles/red.png");
        this.load.image("testimg", "assets/sprites/1bitblock0.png");
    }

    create() {
        this.sky = this.add.image(0, 0, "sky");
        this.sky.setOrigin(0, 0);
        this.sky.displayWidth = window.innerWidth;
        this.sky.displayHeight = window.innerHeight;

        //----------------- Center image --------------------------
        // this.testImg = this.add.image(0, 0, "testimg");
        // this.testImg.x = game.config.width / 2;
        // this.testImg.y = game.config.height / 2;

        var particles = this.add.particles("red");

        var emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: "ADD",
        });

        var logo = this.physics.add.image(400, 100, "logo");

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);

        emitter.startFollow(logo);
    }
}
