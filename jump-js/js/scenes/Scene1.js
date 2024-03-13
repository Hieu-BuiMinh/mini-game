class Scene1 extends Phaser.Scene {
	constructor() {
		super('bootGame')
	}

	preload() {
		this.load.setBaseURL('./assets')

		this.load.image('background', '/img/background.png')

		this.load.spritesheet('ship', '/img/ship.png', {
			frameWidth: 16,
			frameHeight: 16,
		})
		this.load.spritesheet('ship2', '/img/ship2.png', {
			frameWidth: 32,
			frameHeight: 16,
		})
		this.load.spritesheet('ship3', '/img/ship3.png', {
			frameWidth: 32,
			frameHeight: 32,
		})
		this.load.spritesheet('explosion', '/img/explosion.png', {
			frameWidth: 16,
			frameHeight: 16,
		})
	}

	create() {
		this.add.text(20, 20, 'Loading game...')
		// this.scene.start('playGame')

		this.scene.launch('playGame')
	}
}

export { Scene1 }
