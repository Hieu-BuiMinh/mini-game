class Beam extends Phaser.GameObjects.Image {
	constructor(scene) {
		let x = scene.player.x
		let y = scene.player.y
		super(scene, x, y, 'beam')

		scene.add.existing(this)

		scene.physics.world.enableBody(this)
		this.body.velocity.y = -250
	}

	update() {
		if (this.y < 10) {
			this.destroy()
		}
	}
}

export { Beam }
