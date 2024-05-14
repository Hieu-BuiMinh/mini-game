class Scene1 extends Phaser.Scene {
	constructor() {
		super('bootGame')
	}

	preload() {
		this.load.image('background', '../assets/images/background.png')
		this.load.image('platform', '../assets/images/platform.png')
		this.load.image('diamond', '../assets/images/diamond.png')
		this.load.spritesheet('player', '../assets/images/player.png', {
			frameWidth: 32,
			frameHeight: 48,
		})
	}

	create() {
		this.createAnims()
		this.add.text(20, 20, 'Loading game...')
		this.scene.start('playGame')
	}

	createAnims() {
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1,
		})

		this.anims.create({
			key: 'turn',
			frames: [{ key: 'player', frame: 4 }],
			frameRate: 20,
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
			frameRate: 10,
			repeat: -1,
		})
	}
}

export { Scene1 }
