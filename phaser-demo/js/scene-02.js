import { Beam } from './class/beam.js'
import { Explosion } from './class/explosion.js'
import { gameSettings } from './index.js'

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

class Scene2 extends Phaser.Scene {
	constructor() {
		super('playGame')
	}

	preload() {
		this.background = this.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'background')
		this.background.setOrigin(0, 0)

		this.player = this.physics.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100, 'player')
		this.player.setScale(0.35)
		this.player.setCollideWorldBounds(true)
		console.log(this.player)

		this.cursorKeys = this.input.keyboard.createCursorKeys()
		this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

		this.ship1 = this.add.sprite(SCREEN_WIDTH / 2 - 50, SCREEN_HEIGHT / 2, 'ship')
		this.ship1.setScale(1.8)
		this.ship2 = this.add.sprite(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'ship2')
		this.ship2.setScale(1.8)
		this.ship3 = this.add.sprite(SCREEN_WIDTH / 2 + 50, SCREEN_HEIGHT / 2, 'ship3')
		this.ship3.setScale(1.8)
	}

	create() {
		this.score = 0
		this.ScoreLabel = this.add.text(20, 20, `Score: ${this.score}`, { font: '700 25px Arial', fill: 'white' })

		this.projectiles = this.add.group()
		this.enemies = this.physics.add.group()

		this.back_sound = this.sound.add('back_sound')
		this.beam_sound = this.sound.add('beam_sound')
		this.explosion_sound = this.sound.add('explosion_sound')
		this.power_up_sound = this.sound.add('power_up_sound')

		let back_sound_config = { mute: false, volume: 1, rate: 1, detune: 0, seek: 0, loop: false, delay: 0 }
        this.back_sound.play(back_sound_config)

		this.ship1.play('ship1_anim')
		this.ship2.play('ship2_anim')
		this.ship3.play('ship3_anim')
		this.ship1.setInteractive()
		this.ship2.setInteractive()
		this.ship3.setInteractive()
		this.enemies.add(this.ship1)
		this.enemies.add(this.ship2)
		this.enemies.add(this.ship3)

		this.input.on('gameobjectdown', this.destroyShip, this)

		this.physics.world.setBoundsCollision()
		this.powerUps = this.physics.add.group()

		let maxObjects = 4
		for (let i = 0; i <= maxObjects; i++) {
			let powerUp = this.physics.add.sprite(16, 16, 'power-up')
			this.powerUps.add(powerUp)
			powerUp.setRandomPosition(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

			if (Math.random() > 0.5) {
				powerUp.play('red')
			} else {
				powerUp.play('gray')
			}
			powerUp.setVelocity(100, 100)
			powerUp.setCollideWorldBounds(true)
			powerUp.setBounce(1)
		}

		this.physics.add.collider(this.projectiles, this.powerUps, (projectile) => {
			projectile.destroy()
		})
		this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this)
		this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this)
		this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this)
	}

	update() {
		this.moveShip(this.ship1, 5)
		this.moveShip(this.ship2, 10)
		this.moveShip(this.ship3, 15)

		this.background.tilePositionY -= 2

		this.movePlayerManager()

		for (const element of this.projectiles.getChildren()) {
			element.update()
		}
	}

	moveShip(ship, speed) {
		ship.y += speed
		if (ship.y > SCREEN_HEIGHT) {
			this.resetShipPos(ship)
		}
	}

	resetShipPos(ship) {
		ship.y = 0
		let randomX = Phaser.Math.Between(0, SCREEN_WIDTH)
		ship.x = randomX
	}

	destroyShip(pointer, gameObject) {
		gameObject.setTexture('explosion')
		gameObject.play('explode')
	}

	shootBeam() {
		let beam = new Beam(this)
		this.physics.world.enableBody(beam)
		beam.body.velocity.y = -250

		this.projectiles.add(beam)
		this.beam_sound.play()
	}

	movePlayerManager() {
		this.player.body?.setVelocity(0)

		if (this.cursorKeys.left.isDown) {
			this.player.body?.setVelocityX(-gameSettings.playerSpeed)
		} else if (this.cursorKeys.right.isDown) {
			this.player.body?.setVelocityX(gameSettings.playerSpeed)
		}

		if (this.cursorKeys.up.isDown) {
			this.player.body?.setVelocityY(-gameSettings.playerSpeed)
		} else if (this.cursorKeys.down.isDown) {
			this.player.body?.setVelocityY(gameSettings.playerSpeed)
		}

		if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
			if (this.player.active) {
				this.shootBeam()
			}
		}
	}

	pickPowerUp(player, powerUp) {
        this.power_up_sound.play()
		powerUp.disableBody(true, true) // inactive and hide
		// or
		// powerUp.destroy()
	}

	hurtPlayer(player, enemy) {
		this.resetShipPos(enemy)

		if (this.player.alpha < 1) return

		let explosion = new Explosion(this, player.x, player.y)
		this.explosion_sound.play()

		player.disableBody(true, true)

		this.time.addEvent({
			delay: 1000,
			callback: () => this.resetPlayer(player),
			callbackScope: this,
			loop: false,
		})
	}

	hitEnemy(projectile, enemy) {
		this.resetShipPos(enemy)

		let explosion = new Explosion(this, enemy.x, enemy.y)
		this.explosion_sound.play()
		projectile.destroy()
		this.score += 5
		this.ScoreLabel.text = `Score: ${this.score}`
	}

	resetPlayer(player) {
		player.disableBody(false, false)
		let x = SCREEN_WIDTH / 2
		let y = SCREEN_HEIGHT

		player.enableBody(true, x, y, true, true)
		player.alpha = 0.5

		let tween = this.tweens.add({
			targets: player,
			y: SCREEN_HEIGHT - 100,
			ease: 'Power1',
			duration: 2500,
			repeat: 0,
			onComplete: () => {
				player.alpha = 1
			},
			callbackScope: this,
		})
	}
}

export { Scene2 }
