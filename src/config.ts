import Phaser from "phaser";
import * as Constants from "./Constants"
import World from './scenes/Game';
import UI from './scenes/UI';
import StartScene from './scenes/StartScreen'

export default {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#6c90a4",
  scale: {
    width: Constants.WINDOW_SIZE.w,
    height: Constants.WINDOW_SIZE.h,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
  scene: [ UI, StartScene, World ]
};
