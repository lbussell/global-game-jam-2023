import Phaser, { Game, Input } from "phaser";
import * as Constants from '../Constants';
import { Position } from '../Constants';

import {
  AssetLoader,
  BranchSprite,
  GroundTiles,
  LeavesSprite,
  RootSprite,
  RootSprites,
  TestTiles,
  WaterTiles,
  PotassiumTiles,
  AbovegroundBGM,
  UndergroundBGM,
  ParticleSprite,
  DiggingSFX,
  KSFX,
  H2OSFX,
  LeavesSprites
} from '../Assets';

import Underground from '../Underground';
import Roots from "../Roots";
import InputManager from "../InputManager";
import CameraManager from "../CameraManager";
import GameManager from "../GameManager";
import ProceduralTree from "../ProceduralTree";
import AudioManager from "../AudioManager";
import { NormalRoot, RootType } from "../RootTypes";
import ParticleManaager from "../ParticleManager"

export default class World extends Phaser.Scene {
  public gameManager?: GameManager;
  public isLoaded: boolean;
  public blockPlacement: boolean;

  private particleManager?: ParticleManaager;
  private cameraManager?: CameraManager;
  private inputManager?: InputManager;
  private underground?: Underground;
  private roots?: Roots;
  private tree?: ProceduralTree;
  private clicked: integer;
  private lastGhost: number = 0;

  private timeText?: Phaser.GameObjects.BitmapText;

  private audioManager?: AudioManager;

  constructor() {
    super({ key: 'GameScene' });
    this.isLoaded = false;
    this.clicked = 0;
    this.blockPlacement = false;

    // stuff that will be loaded in create()
    this.timeText = undefined;
  }

  preload() {
    AssetLoader.loadSprite(this, BranchSprite)
    AssetLoader.loadSprite(this, LeavesSprite)
    AssetLoader.loadSprite(this, RootSprite);
    AssetLoader.loadSprite(this, ParticleSprite);
    AssetLoader.loadSpriteSheet(this, TestTiles);
    AssetLoader.loadSpriteSheet(this, WaterTiles);
    AssetLoader.loadSpriteSheet(this, PotassiumTiles);
    AssetLoader.loadSpriteSheet(this, RootSprites);
    AssetLoader.loadSpriteSheet(this, GroundTiles);
    AssetLoader.loadSpriteSheet(this, LeavesSprites);

    AssetLoader.loadAudio(this, AbovegroundBGM);
    AssetLoader.loadAudio(this, UndergroundBGM);
    AssetLoader.loadAudio(this, DiggingSFX);
    AssetLoader.loadAudio(this, KSFX);
    AssetLoader.loadAudio(this, H2OSFX);
  }

  unload() {

  }

  create() {
    this.tree = new ProceduralTree(this, Constants.WINDOW_SIZE.w/2, Constants.WINDOW_SIZE.h/2);
    this.gameManager = new GameManager(this.tree);
    this.cameraManager = new CameraManager(this);
    this.inputManager = new InputManager(this);
    this.underground = new Underground(this, this.cameras.main);
    if(!this.audioManager){
      this.audioManager = new AudioManager(this, ['aboveground', 'underground'], ['digSFX', 'kSFX', 'h2oSFX']);
      this.audioManager.playLoops();
    }
    this.particleManager = new ParticleManaager(this, this.audioManager);
    this.input.keyboard.on('keydown-M', () => this.audioManager?.toggleMuteAll());

    this.inputManager.tabKey.on('up', () => this.cameraManager?.SwapCameraPos());
    this.inputManager.lKey.on('up', () => this.gameManager?.levelUp());

    this.input.on('wheel',
      (
        pointer: Phaser.Input.Pointer,
        foo: number,
        deltaX: number,
        deltaY: number,
        event: Phaser.Types.Input.EventData
      ) => {
        this.cameraManager?.MoveCamera(deltaY);
        // if (deltaY > 0) {
        //   this.cameraManager?.MoveCameraUp();
        // }
        // if (deltaY < 0) {
        //   this.cameraManager?.MoveCameraDown();
        // }
      })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // click stuff here
    });

    this.roots = new Roots(this, new Phaser.Math.Vector2(Constants.WINDOW_SIZE.w / 2 - 4, 10), this.underground, this.gameManager, this.particleManager, this.audioManager);

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
        if (this.clicked + 300 < time && !this.blockPlacement)
        {
          this.roots?.createGhost(worldPoint, this.gameManager?.activeRootType ?? NormalRoot());
          this.clicked = time;
        }
        else if (this.lastGhost + 50 < time)
        {
          this.roots?.findAndDrawBestGhost(worldPoint, this.gameManager?.activeRootType ?? NormalRoot());
          this.lastGhost = time;
        }
      }
      else if (this.lastGhost + 50 < time)
      {
        this.roots?.findAndDrawBestGhost(worldPoint, this.gameManager?.activeRootType ?? NormalRoot());
        this.lastGhost = time;
      }

      // Draw the grid
      this.underground?.drawGrid(this.cameraManager?.currentPos.getCenter());

      this.tree?.animateLeaves(time);
      //manage audio switching between above/belowground
      this.audioManager?.interpolateVolume();
    }
  }
}
