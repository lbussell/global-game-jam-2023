import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/Game";
import UI from "./scenes/UI";
import StartScene from "./scenes/StartScreen"

new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene, UI, StartScene],
  })
);
