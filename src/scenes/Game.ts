import Phaser, { Game, Input } from "phaser";
import * as Constants from '../Constants';
import { Position } from '../Constants';
import Underground from '../Underground';
import Roots from "../Roots";
import InputManager from "../InputManager";
import CameraManager from "../CameraManager";
import GameManager from "../GameManager";
import ProceduralTree from "../ProceduralTree";

import {
  AssetLoader,
  BranchSprite,
  GroundTiles,
  LeavesSprite,
  RootSprite,
  RootSprites,
  TestTiles,
  WaterTiles,
} from '../Assets';

export default class World extends Phaser.Scene {
  public gameManager?: GameManager;
  public isLoaded: boolean;

  private cameraManager?: CameraManager;
  private inputManager?: InputManager;
  private underground?: Underground;
  private roots?: Roots;
  private tree?: ProceduralTree;
  private clicked: integer;
  private lastGhost: number = 0;

  private timeText?: Phaser.GameObjects.BitmapText;

  constructor() {
    super("GameScene");
    this.isLoaded = false;
    this.clicked = 0;

    // stuff that will be loaded in create()
    this.timeText = undefined;
  }

  preload() {
    AssetLoader.loadSprite(this, BranchSprite)
    AssetLoader.loadSprite(this, LeavesSprite)
    AssetLoader.loadSprite(this, RootSprite);
    AssetLoader.loadSpriteSheet(this, TestTiles);
    AssetLoader.loadSpriteSheet(this, WaterTiles);
    AssetLoader.loadSpriteSheet(this, RootSprites);
    AssetLoader.loadSpriteSheet(this, GroundTiles);
  }

  unload() {

  }

  create() {
    this.gameManager = new GameManager();
    this.gameManager = new GameManager();
    this.cameraManager = new CameraManager(this);
    this.inputManager = new InputManager(this);
    this.underground = new Underground(this, this.cameras.main);

    this.inputManager.tabKey.on('up', () => this.cameraManager?.SwapCameraPos())

    this.input.on('wheel',
      (
        pointer: Phaser.Input.Pointer,
        foo: number,
        deltaX: number,
        deltaY: number,
        event: Phaser.Types.Input.EventData
      ) => {
        if (deltaY > 0) {
          this.cameraManager?.MoveCameraUp();
        }
        if (deltaY < 0) {
          this.cameraManager?.MoveCameraDown();
        }
      })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // click stuff here
    });

    this.roots = new Roots(this, new Phaser.Math.Vector2(Constants.WINDOW_SIZE.w / 2 - 4, 10), this.underground);

    this.tree = new ProceduralTree(this, Constants.WINDOW_SIZE.w/2, Constants.WINDOW_SIZE.h/2);

    // Don't add anything to this function below here
    this.isLoaded = true;
  }

  addSprite(key: string, pos: Position) {
    this.add.sprite(pos.x, pos.y, key, 4).setOrigin(0.5).setScale(3);
  }

  update(time: number, delta: number): void {
    if (this.isLoaded) {
      const worldPoint: Phaser.Math.Vector2 = <Phaser.Math.Vector2> this.input.activePointer.positionToCamera(this.cameras.main);

      this.gameManager?.updateAttachedResources(delta);

      this.gameManager?.updateAttachedResources(delta);

      if (this.input.manager.activePointer.isDown)
      {
        if (this.clicked + 300 < time )
        {
          this.roots?.createGhost(worldPoint);
          this.clicked = time;
        }
      }
      else if (this.lastGhost + 50 < time)
      {
        this.roots?.findAndDrawBestGhost(worldPoint);
        this.lastGhost = time;
      }

      // Draw the grid
      this.underground?.drawGrid();
    }
  }
}
