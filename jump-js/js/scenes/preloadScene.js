const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

class PreloadScene extends Phaser.Scene {
	constructor() {
		super('PreloadScene')
	}

	preload() {
		this.load.setBaseURL('./assets')

		this.load.image('ground_block', '/img/ground-block.png')
		this.load.image('diamond', '/img/diamond.png')
		
		this.load.spritesheet('explosion', '/img/explosion.png', {
			frameWidth: 16,
			frameHeight: 16,
		})
	}

	create() {
		this.add.text(20, 20, 'Loading game...')

		this.scene.start('GameScene')
	}
}

export { PreloadScene }
