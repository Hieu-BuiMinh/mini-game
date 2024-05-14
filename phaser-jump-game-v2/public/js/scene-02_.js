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
		this.background = this.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'background').setScrollFactor(1, 0).setOrigin(0, 0)

		this.platforms = this.physics.add.staticGroup()

		for (let i = 0; i < 5; i++) {
			let _x = Phaser.Math.Between(80, 400)
			let _y = 150 * i

			let _platform = this.platforms.create(_x, _y, 'platform')
			_platform.scale = 0.7
			let _body = _platform.body
			_body.updateFromGameObject()
		}

		this.player = this.physics.add.sprite(240, 320, 'player').setScale(0.5)
		this.player.body.checkCollision.up = false
		this.player.body.checkCollision.left = false
		this.player.body.checkCollision.right = false

		this.diamonds = this.physics.add.group({
			classType: Diamond,
		})

		this.physics.add.collider(this.platforms, this.player)
		this.physics.add.collider(this.platforms, this.diamonds)

		this.physics.add.overlap(this.player, this.diamonds, this.onOverlapDiamond, undefined, this)

		this.cameras.main.startFollow(this.player)
		this.cameras.main.setDeadzone(this.scale.width * 1.5)

		const style = { color: '#fff', fontSize: 30, fontWeight: 700, font: 'Arial' }
		this.diamondsCollectedText = this.add.text(10, 10, 'Score: 0', style).setScrollFactor(0).setOrigin(0)
	}

	update() {
		let _touchingDown = this.player.body.touching.down
		if (_touchingDown) {
			this.player.setVelocityY(-500)
		}

		if (this.cursors.left.isDown && !_touchingDown) {
			this.player.setVelocityX(-200)
			this.player.play('left', true)
		} else if (this.cursors.right.isDown && !_touchingDown) {
			this.player.setVelocityX(200)
			this.player.play('right', true)
		} else {
			this.player.setVelocityX(0)
			this.player.play('turn', true)
		}

		this.platforms.children.iterate((child) => {
			const platform = child
			const scrollY = this.cameras.main.scrollY
			if (platform.y >= scrollY + 700) {
				platform.y = scrollY - Phaser.Math.Between(50, 100)
				platform.body.updateFromGameObject()
				this.addDiamondAbove(platform)
			}
		})

		this.horinzontalWrap(this.player)

		const bottomPlatform = this.findBottomMostPlatform()
		if (this.player.y > bottomPlatform.y + 700) {
			console.log('game over')
			this.scene.start('gameover')
		}
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

	findBottomMostPlatform() {
		const platforms = this.platforms.getChildren()
		let bottomPlatform = platforms[0]

		for (const element of platforms) {
			const platform = element

			if (platform.y < bottomPlatform.y) continue

			bottomPlatform = platform
		}

		return bottomPlatform
	}
}

export { Scene2 }
