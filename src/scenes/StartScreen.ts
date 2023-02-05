import Phaser from "phaser";
import GameScene from "./Game";
import config from "../config";
import { 
    ArcadeFont,
    AssetLoader,
    StartBackground,
} from "../Assets";
import World from "./Game";
import { TILE_SCALE, TILE_SIZE, WINDOW_SIZE, GAME_TITLE } from "../Constants";

export default class Start extends Phaser.Scene {
    private _isLoaded: boolean;
    private _gameScene?: World;

    constructor() {
        super("StartScene");
        this._isLoaded = false;
        Phaser.Scene.call(this, { key: "StartScene", active: true });
    }

    preload() {
        AssetLoader.loadFont(this, ArcadeFont);
        AssetLoader.loadSprite(this, StartBackground)

        this._isLoaded = true;
    }

    create()
    {
        this._gameScene = <World> this.scene.get("GameScene");

        //this.add.image(WINDOW_SIZE.w, WINDOW_SIZE.h, StartBackground);
        this.add.sprite(0, 0, StartBackground.key).setOrigin(0).setScale(TILE_SCALE);

        this.add.text(80, 560, 'Game Title: ' + GAME_TITLE);

        this.input.on('pointerup', ()=> {

            Object.assign(config, {
                scene: [GameScene],
              })

            this.scene.start('GameScene');

        }, this);
    }
}