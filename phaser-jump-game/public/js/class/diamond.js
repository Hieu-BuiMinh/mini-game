class Diamond extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, texture) {
		super(scene, x, y, texture)
		this.setScale(0.5)
	}
}

export { Diamond }
