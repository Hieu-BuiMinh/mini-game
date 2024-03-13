const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

class Scene2 extends Phaser.Scene {
	constructor() {
		super('playGame')
	}

	create() {
		this.background = this.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'background')
		this.background.setOrigin(0, 0)
		this.background.setScale(5)

		this.ship1 = this.add.sprite(SCREEN_WIDTH / 2 - 50, SCREEN_HEIGHT / 2, 'ship')
		this.ship2 = this.add.sprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'ship2')
		this.ship3 = this.add.sprite(SCREEN_WIDTH / 2 + 50, SCREEN_HEIGHT / 2, 'ship3')

		this.add.text(20, 20, 'Playing game', {
			font: '25px Arial',
			fill: 'yellow',
		})

		this.anims.create({
			key: 'ship_anim1',
			frames: this.anims.generateFrameNumbers('ship'),
			frameRate: 20,
			repeat: -1,
		})
		this.anims.create({
			key: 'ship_anim2',
			frames: this.anims.generateFrameNumbers('ship2'),
			frameRate: 20,
			repeat: -1,
		})
		this.anims.create({
			key: 'ship_anim3',
			frames: this.anims.generateFrameNumbers('ship3'),
			frameRate: 20,
			repeat: -1,
		})
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

		this.ship1.play('ship_anim1')
		this.ship2.play('ship_anim2')
		this.ship3.play('ship_anim3')

		this.ship1.setInteractive()
		this.ship2.setInteractive()
		this.ship3.setInteractive()

		this.input.on('gameobjectdown', this.destroyShip, this)
	}

	moveShip(ship, speed) {
		ship.y += speed
		if (ship.y > SCREEN_HEIGHT) {
			this.resetShipPos(ship)
		}
	}

	resetShipPos(ship) {
		ship.y = 0
		ship.x = Phaser.Math.Between(0, SCREEN_WIDTH)
	}

	update() {
		this.moveShip(this.ship1, 2)
		this.moveShip(this.ship2, 3)
		this.moveShip(this.ship3, 4)

		this.background.tilePositionY -= 1
	}

	destroyShip(pointer, gameObject) {
		gameObject.setTexture('explosion')
		gameObject.play('explode')
	}
}

export { Scene2 }
