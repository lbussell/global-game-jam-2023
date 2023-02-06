import Phaser from "phaser";
import GameScene from "./Game";
import config from "../config";
import { 
    ArcadeFont,
    AssetLoader,
    StartBackground,
    GameTitle,
} from "../Assets";
import World from "./Game";
import { TILE_SCALE, TILE_SIZE, WINDOW_SIZE, GAME_TITLE } from "../Constants";

export default class Start extends Phaser.Scene {
    private _isLoaded: boolean;
    private _gameScene?: World;
    private _titleSprite?: Phaser.GameObjects.Sprite

    constructor() {
        super("StartScene");
        this._isLoaded = false;
        Phaser.Scene.call(this, { key: "StartScene", active: true });
    }

    preload() {
        AssetLoader.loadFont(this, ArcadeFont);
        AssetLoader.loadSprite(this, StartBackground)
        AssetLoader.loadSprite(this, GameTitle);

        this._isLoaded = true;
    }

    create()
    {
        this._gameScene = <World> this.scene.get("GameScene");

        this.add.sprite(0, 0, StartBackground.key).setOrigin(0).setScale(TILE_SCALE);

        this._titleSprite = this.add.sprite(0.5 * WINDOW_SIZE.w, 0.5 * WINDOW_SIZE.h, GameTitle.key).setOrigin(0.5).setScale(TILE_SCALE * 1.5);

        this.add.text(0.5 * WINDOW_SIZE.w - 110, 0.5 * WINDOW_SIZE.h + 70, 'Click anywhere to start').setOrigin(0);

        this.input.on('pointerup', ()=> {

            Object.assign(config, {
                scene: [GameScene],
              })

            this.scene.start('GameScene');

        }, this);
    }

    update (time: number, delta: number): void {
        var inity = 0.5 * WINDOW_SIZE.h;
        var a = 5;
        var f = 10;
        //var ypos = inity + (a * Math.sin(2 * Math.PI * f * time));
        var ypos = inity + a * Math.sin(2 * Math.PI * time * 0.001)
        //var ypos = inity - time * .1;
        var xpos = 0.5 * WINDOW_SIZE.w;
        this._titleSprite?.setPosition(xpos, ypos);
    }
}