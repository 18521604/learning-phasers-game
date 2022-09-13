var game;
window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 200 },
            },
        },
        scene: [SceneMain],
    };

    game = new Phaser.Game(config);
};
