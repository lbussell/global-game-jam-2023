import Phaser, { Game, Input } from "phaser";
import * as Constants from '../Constants';
import {
  Size,
  Position,
} from '../Constants';
import {
  AssetLoader,
  Font,
  Asset,
  SpriteSheet,
  Sprite,
  TestTiles,
  RootSprites,
  ArcadeFont
} from '../Assets';
import Underground from '../Underground';
import Roots from "../Roots";
import InputManager from "../InputManager";
import CameraManager from "../CameraManager";
import GameManager from "../GameManager";

export default class World extends Phaser.Scene {
  public gameManager?: GameManager;
  public isLoaded: boolean;

  private cameraManager?: CameraManager;
  private inputManager?: InputManager;
  private underground?: Underground;
  private roots?: Roots
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
    AssetLoader.loadSpriteSheet(this, TestTiles);
    AssetLoader.loadSpriteSheet(this, RootSprites);
  }

  unload() {

  }

  create() {
    this.gameManager = new GameManager();
    this.cameraManager = new CameraManager(this);
    this.inputManager = new InputManager(this);
    this.underground = new Underground(this, this.cameras.main);

    // test text.. later, add this to its own UI scene that sits on top of this scene
    // this.addBitmapTextByLine(0, 0, 'fingus');
    // this.addBitmapTextByLine(0, 1, 'bingus');
    // this.timeText = this.addBitmapText(0, 0, this.formatTimeString(0));

    // this.cameras.main.

    this.inputManager.tabKey.on('up', () => this.cameraManager?.SwapCameraPos())

    this.input.on('wheel',
      (
        pointer: Phaser.Input.Pointer,
        foo: number,
        deltaX: number,
        deltaY: number,
        event: Phaser.Types.Input.EventData
      ) => {
        console.log(deltaY)
        if (deltaY > 0) {
          this.cameraManager?.MoveCameraUp();
        }
        if (deltaY < 0) {
          this.cameraManager?.MoveCameraDown();
        }
      })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // old underground tile-based root logic:
      // this.underground?.click(new Phaser.Math.Vector2(pointer.worldX, pointer.worldY));
    });

    this.roots = new Roots(this, new Phaser.Math.Vector2(Constants.WINDOW_SIZE.w / 2 - 4, 10), this.underground);

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

      if (this.input.manager.activePointer.isDown)
      {
        if (this.clicked + 300 < time )
        {

          // LEGACY CONTROLLER:
          // this.underground?.click(worldPoint);

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
