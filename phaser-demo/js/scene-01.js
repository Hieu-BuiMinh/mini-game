class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("background", "assets/images/background.png");
        this.load.image("player", "assets/images/player.png");
        this.load.image("beam", "assets/images/beam.png");

        this.load.audio('back_sound', ['assets/mp3/sound.mp3'])
        this.load.audio('beam_sound', ['assets/mp3/beam.mp3'])
        this.load.audio('explosion_sound', ['assets/mp3/explosion.mp3'])
        this.load.audio('power_up_sound', ['assets/mp3/power_up.mp3'])

        this.load.spritesheet("ship", "assets/spritesheets/ship.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("ship2", "assets/spritesheets/ship2.png", {
            frameWidth: 32,
            frameHeight: 16
        });
        this.load.spritesheet("ship3", "assets/spritesheets/ship3.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("explosion", "assets/spritesheets/explosion.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("power-up", "assets/spritesheets/power-up.png", {
            frameWidth: 16,
            frameHeight: 16
        });
    }

    create() {
        // this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");


        this.anims.create({
            key: "ship1_anim",
            frames: this.anims.generateFrameNumbers("ship"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship2_anim",
            frames: this.anims.generateFrameNumbers("ship2"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "ship3_anim",
            frames: this.anims.generateFrameNumbers("ship3"),
            frameRate: 20,
            repeat: -1
        });

        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });
        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "gray",
            frames: this.anims.generateFrameNumbers("power-up", {
                start: 2,
                end: 3
            }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "beam",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 20,
            repeat: -1
        });
    }
}

export { Scene1 }