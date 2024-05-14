import { Scene1 } from "./scene-01.js";
import { Scene2 } from "./scene-02.js";

const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight

const gameSettings = {
    playerSpeed: 350
}

const config = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 0x000000,
    scene: [Scene1, Scene2],
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    }
}


const game = new Phaser.Game(config);

export { game, gameSettings }