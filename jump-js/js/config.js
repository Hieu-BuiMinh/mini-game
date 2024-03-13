import { Scene1 } from './scenes/Scene1.js'
import { Scene2 } from './scenes/Scene2.js'
import { PreloadScene } from './scenes/preloadScene.js'
import { GameScene } from './scenes/gameScene.js'

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

const gameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#6ADDF2',
	// transparent: true,
	scale: {
		mode: Phaser.Scale.RESIZE,
		parent: 'phaser-example',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	// scene: [Scene1, Scene2],
	scene: [PreloadScene, GameScene],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false,
		},
	},
	zoom: Phaser.Scale.Zoom.ZOOM_4X,
}

export { gameConfig }
