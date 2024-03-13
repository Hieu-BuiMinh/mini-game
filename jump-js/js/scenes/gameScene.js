const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene')
	}

	preload() {
		this.ground_blocks = this.physics.add.staticGroup()

		this.player = this.physics.add.sprite(35, 500, 'diamond')
		this.player.body.setGravityY(300)
		this.player.setCollideWorldBounds(true)

		this.ground_block_02 = this.ground_blocks.create(148 / 2, 18, 'ground_block')
		this.ground_block_03 = this.ground_blocks.create(SCREEN_WIDTH - 148 / 2, 150, 'ground_block')
		this.ground_block_04 = this.ground_blocks.create(148 / 2, 300, 'ground_block')
		this.ground_block_05 = this.ground_blocks.create(SCREEN_WIDTH - 148 / 2, 450, 'ground_block')
		this.ground_block_06 = this.ground_blocks.create(148 / 2, 600, 'ground_block')

		// this.player.setOrigin(0, 0)
		// this.ground_block_02.setOrigin(0, 0)
		// this.ground_block_03.setOrigin(0, 0)
		// this.ground_block_04.setOrigin(0, 0)
		// this.ground_block_05.setOrigin(0, 0)
		// this.ground_block_06.setOrigin(0, 0)

		this.anims.create({
			key: 'explode',
			frames: this.anims.generateFrameNumbers('explosion'),
			frameRate: 20,
			repeat: 0,
			hideOnComplete: true,
		})
	}

	create() {
		let angle = 0
		const line = new Phaser.Geom.Line()
		const graphics = this.add.graphics({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } })

		this.input.on('pointermove', (pointer) => {
			angle = Phaser.Math.Angle.BetweenPoints(this.player, pointer)
			Phaser.Geom.Line.SetToAngle(line, this.player.x, this.player.y, angle, 128)
			graphics.clear().strokeLineShape(line)
		})

		this.input.on('pointerup', () => {
			console.log('up')
			this.physics.velocityFromRotation(angle, 900, this.player.body.velocity)
		})
		this.input.on('pointerdown', () => {
			console.log('down')
		})

		this.physics.add.collider(this.player, this.ground_block_02)
		this.physics.add.collider(this.player, this.ground_block_03)
		this.physics.add.collider(this.player, this.ground_block_04)
		this.physics.add.collider(this.player, this.ground_block_05)
		this.physics.add.collider(this.player, this.ground_block_06)
	}

	moveGround(ground, speed) {
		ground.y += speed
		if (ground.y > SCREEN_HEIGHT - 35) {
			this.resetGroundPos(ground)
		}
	}
	movePlayer(player, speed) {
		player.y += speed
	}

	resetGroundPos(ground) {
		ground.y = 0
		ground.x = Phaser.Math.Between(0, SCREEN_WIDTH - 148)
	}

	update() {
		this.moveGround(this.ground_block_02, 1)
		this.moveGround(this.ground_block_03, 1)
		this.moveGround(this.ground_block_04, 1)
		this.moveGround(this.ground_block_05, 1)
		this.moveGround(this.ground_block_06, 1)
		// this.movePlayer(this.player, 1)
		
		if (this.player.y + this.player.width >= SCREEN_HEIGHT) {
			this.player.setTexture('explosion')
			this.player.play('explode')
		}
	}
}

export { GameScene }
