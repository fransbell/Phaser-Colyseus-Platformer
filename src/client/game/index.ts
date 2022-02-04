import Phaser from "phaser"
import config from "./config"
import GameScene from "./utils/scenes/Game"

new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene],
  })
)
