import { gameSettings } from "./index.js";

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    preload() {
        this.background = this.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "background");
        this.background.setOrigin(0, 0);

        this.player = this.physics.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "player")
        this.player.setScale(0.35)
        this.player.setCollideWorldBounds(true)
        this.cursorKeys = this.input.keyboard.createCursorKeys()
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // console.log(this.background)
        this.background._tileScale.x = 4
        this.background._tileScale.y = 4

        this.ship1 = this.add.sprite(SCREEN_WIDTH / 2 - 50, SCREEN_HEIGHT / 2, "ship");
        this.ship2 = this.add.sprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "ship2");
        this.ship3 = this.add.sprite(SCREEN_WIDTH / 2 + 50, SCREEN_HEIGHT / 2, "ship3");

        this.add.text(20, 20, "Playing game", {
            font: "25px Arial",
            fill: "yellow"
        });

    }

    create() {
        this.add.text(20, 20, "Playing game", { font: "25px Arial", fill: "yellow" });

        this.ship1.play("ship1_anim");
        this.ship2.play("ship2_anim");
        this.ship3.play("ship3_anim");
        this.ship1.setInteractive();
        this.ship2.setInteractive();
        this.ship3.setInteractive();

        this.input.on('gameobjectdown', this.destroyShip, this);

        this.physics.world.setBoundsCollision();
        this.powerUps = this.physics.add.group();

        var maxObjects = 4;
        for (var i = 0; i <= maxObjects; i++) {
            var powerUp = this.physics.add.sprite(16, 16, "power-up");
            this.powerUps.add(powerUp);
            powerUp.setRandomPosition(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

            if (Math.random() > 0.5) {
                powerUp.play("red");
            } else {
                powerUp.play("gray");
            }
            powerUp.setVelocity(100, 100);
            powerUp.setCollideWorldBounds(true);
            powerUp.setBounce(1);
        }
    }

    update() {
        this.moveShip(this.ship1, 1);
        this.moveShip(this.ship2, 2);
        this.moveShip(this.ship3, 3);

        this.background.tilePositionY -= 0.5;

        this.movePlayerManager()
    }

    moveShip(ship, speed) {
        ship.y += speed;
        if (ship.y > SCREEN_HEIGHT) {
            this.resetShipPos(ship);
        }
    }

    resetShipPos(ship) {
        ship.y = 0;
        var randomX = Phaser.Math.Between(0, SCREEN_WIDTH);
        ship.x = randomX;
    }

    destroyShip(pointer, gameObject) {
        gameObject.setTexture("explosion");
        gameObject.play("explode");
    }

    movePlayerManager() {
        if (this.cursorKeys.left.isDown) {
            this.player.setVelocityX(-gameSettings.playerSpeed)
        }
        else if (this.cursorKeys.right.isDown) {
            this.player.setVelocityX(gameSettings.playerSpeed)
        }
        else if (this.cursorKeys.up.isDown) {
            this.player.setVelocityY(-gameSettings.playerSpeed)
        }
        else if (this.cursorKeys.down.isDown) {
            this.player.setVelocityY(gameSettings.playerSpeed)
        }

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            console.log('fire')
        }
    }
}

export { Scene2 }