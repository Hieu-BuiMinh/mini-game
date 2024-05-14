import { Diamond } from './class/diamond.js'

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

class Scene2 extends Phaser.Scene {
	constructor() {
		super('playGame')

		this.player = null
		this.platforms = null
		this.cursors = null

		this.diamonds = null
		this.diamondsCollected = 0
		this.diamondsCollectedText = null
	}

	preload() {
		this.cursors = this.input.keyboard.createCursorKeys()
		this.load.image('diamond', '../assets/images/diamond.png')
	}

	create() {
		this.background = this.add.tileSprite(0, 0, 480, 640, 'background').setScrollFactor(1, 0).setOrigin(0, 0)

		this.platforms = this.physics.add.group()
		this.cursors = this.input.keyboard.createCursorKeys()

		this.diamonds = this.physics.add.group({
			classType: Diamond,
		})

		for (let i = 0; i < 5; i++) {
			let _x = Phaser.Math.Between(80, 400)
			let _y = 150 * i
			if (i === 3) {
				this.player = this.physics.add.sprite(_x, _y - 50, 'player').setScale(0.6)
			}

			let _platform = this.platforms.create(_x, _y, 'platform').setDirectControl().setImmovable()
			_platform.scale = 0.7
			this.addDiamondAbove(_platform)
		}

		this.physics.add.collider(this.player, this.platforms, null, (player, platform) => player.body.velocity.y >= 0)
		this.physics.add.collider(this.platforms, this.diamonds)

		this.physics.add.overlap(this.player, this.diamonds, this.onOverlapDiamond, undefined, this)

		const style = { color: '#fff', fontSize: 30, fontWeight: 700, font: 'Arial' }
		this.diamondsCollectedText = this.add.text(10, 10, 'Score: 0', style).setScrollFactor(0).setOrigin(0)
	}

	update() {
		this.background.tilePositionY -= 2
		this.movePlayer()

		this.platforms.children.iterate((child) => {
			this.movePlatform(child, 1)
		})
		if (this.player.y > 700) {
			console.log('game over')
			this.scene.start('gameover')
		}
		this.horinzontalWrap(this.player)
	}

	movePlatform(platform, speed) {
		platform.y += speed
		if (platform.y > 700) {
			this.resetPlatformPos(platform)
		}
	}

	resetPlatformPos(platform) {
		platform.y = 0
		platform.x = Phaser.Math.Between(80, 400)
		this.addDiamondAbove(platform)
	}

	movePlayer() {
		const { left, right, up } = this.cursors

		if (left.isDown) {
			this.player.setVelocityX(-160)

			this.player.anims.play('left', true)
		} else if (right.isDown) {
			this.player.setVelocityX(160)

			this.player.anims.play('right', true)
		} else {
			this.player.setVelocityX(0)

			this.player.anims.play('turn')
		}

		if (up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-330)
		}
	}

	addDiamondAbove(sprite) {
		const y = sprite.y - sprite.displayHeight
		const diamond = this.diamonds.get(sprite.x, y, 'diamond')
		diamond.setActive(true)
		diamond.setVisible(true)

		this.add.existing(diamond)
		diamond.body.setSize(diamond.width, diamond.height)
		this.physics.world.enable(diamond)

		return diamond
	}

	onOverlapDiamond(_player, _diamond) {
		this.diamonds.killAndHide(_diamond)
		this.physics.world.disableBody(_diamond.body)

		this.diamondsCollected += 10
		this.diamondsCollectedText.text = `Score : ${this.diamondsCollected}`
	}

	horinzontalWrap(sprite) {
		let halfWidth = sprite.displayWidth * 0.5
		let gameWidth = this.scale.width

		if (sprite.x < -halfWidth) {
			sprite.x = gameWidth + halfWidth
		} else if (sprite.x > gameWidth + halfWidth) {
			sprite.x = -halfWidth
		}
	}
}

export { Scene2 }
