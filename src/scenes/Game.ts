import Phaser from "phaser";
import * as Constants from '../Constants';
import {
  Size,
  Position,
  TestTiles, 
} from '../Constants';
import Underground from '../Underground';

export default class World extends Phaser.Scene {

  private isLoaded: boolean;
  private underground?: Underground;
  private clicked: boolean;

  constructor() {
    super("GameScene");
    this.isLoaded = false;
  }

  preload() {
    this.load.spritesheet(
      TestTiles.key,
      TestTiles.location,
      { frameWidth: Constants.TILE_SIZE, frameHeight: Constants.TILE_SIZE }
    );
    this.isLoaded = true;
  }

  unload() {

  }

  create() {
    this.underground = new Underground(this);
  }

  addSprite(key: string, pos: Position) {
    this.add.sprite(pos.x, pos.y, key, 4).setOrigin(0.5).setScale(3);
  }

  update(time: number, delta: number): void {
    if (this.isLoaded) {
      const worldPoint: Phaser.Math.Vector2 = <Phaser.Math.Vector2> this.input.activePointer.positionToCamera(this.cameras.main);

      if (this.input.manager.activePointer.isDown)
      {
        if (!this.clicked)
        {
          this.underground?.click(worldPoint);
          this.clicked = true;
        }
      }
      else
      {
        this.clicked = false;
      }
    }
  }
}

