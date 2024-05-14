import { Scene1 } from "./scene-01.js";
import { Scene2 } from "./scene-02.js";
import { Scene3 } from "./scene-03.js";

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

const gameSettings = {
    playerSpeed: 250
}

const config = {
    type: Phaser.AUTO,
    // width: SCREEN_WIDTH,
    // height: SCREEN_HEIGHT,
    width: 480,
    height: 640,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: true
        }
    },
    scene: [Scene1, Scene2, Scene3],
}


const game = new Phaser.Game(config);

export { game, gameSettings }