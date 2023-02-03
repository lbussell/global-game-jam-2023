import Phaser from "phaser";
import { 
    ArcadeFont,
    AssetLoader,
    GlucoseIcon,
    PotassiumIcon,
    Sprite,
    SunIcon,
    WaterIcon,
} from "../Assets";
import { TILE_SCALE, TILE_SIZE, WINDOW_SIZE } from "../Constants";

export default class UI extends Phaser.Scene {
    private _isLoaded: boolean;
    private _gameScene?: Phaser.Scene;
    private _bottomRect?: Phaser.GameObjects.Rectangle;
    private readonly _bottomRectHeightInTiles: number = 3;

    private _sunText?: Phaser.GameObjects.BitmapText;
    private _waterText?: Phaser.GameObjects.BitmapText;
    private _potasText?: Phaser.GameObjects.BitmapText;
    private _glucoseText?: Phaser.GameObjects.BitmapText;

    private _padding: number = 8;

    constructor() {
        super("UIScene");
        this._isLoaded = false;
        Phaser.Scene.call(this, { key: "UIScene", active: true });
    }

    preload() {
        // this.load.bitmapFont(font.key, font.assetLocation, font.xmlLocation);
        AssetLoader.loadFont(this, ArcadeFont);
        AssetLoader.loadSprite(this, GlucoseIcon);
        AssetLoader.loadSprite(this, PotassiumIcon);
        AssetLoader.loadSprite(this, SunIcon);
        AssetLoader.loadSprite(this, WaterIcon);
    }

    create() {
        this.addBitmapText(0, 0, "deez nuts");
        this._gameScene = this.scene.get("GameScene");
        this._bottomRect = this.add.rectangle(
            0,
            WINDOW_SIZE.h - this._bottomRectHeightInTiles*TILE_SIZE*TILE_SCALE,
            WINDOW_SIZE.w,
            this._bottomRectHeightInTiles*TILE_SIZE*TILE_SCALE,
            0x000000
        ).setOrigin(0, 0);

        const pad = 4;
        const padTop = WINDOW_SIZE.h - this._bottomRectHeightInTiles*TILE_SIZE*TILE_SCALE + pad*TILE_SCALE;
        const padLeft = pad*TILE_SCALE;

        const tile = TILE_SIZE*TILE_SCALE;

        const textPadTop = padTop + TILE_SCALE*2;
        const textToIcon = TILE_SCALE*18;

        const sunLeftIcon = padLeft;
        this.addSprite(sunLeftIcon, padTop, SunIcon);
        this._sunText = this.addBitmapText(sunLeftIcon + textToIcon, textPadTop, "69");

        const waterLeftIcon = padLeft + tile*8;
        this.addSprite(waterLeftIcon, padTop, WaterIcon);
        this._waterText = this.addBitmapText(waterLeftIcon + textToIcon, textPadTop, "420");

        const potasLeftIcon = padLeft + tile*16;
        this.addSprite(potasLeftIcon, padTop, PotassiumIcon);
        this._potasText = this.addBitmapText(potasLeftIcon + textToIcon, textPadTop, "666");

        const glucoseLeftIcon = padLeft + tile*24;
        this.addSprite(padLeft + tile*24, padTop, GlucoseIcon);
        this._glucoseText = this.addBitmapText(glucoseLeftIcon + textToIcon, textPadTop, "1337");

        // don't add to this function below this line
        this._isLoaded = true;
    }
    
    update() {

    }

    addSprite(x: number, y: number, s: Sprite) {
        return this.add.sprite(x, y, s.key).setOrigin(0, 0).setScale(TILE_SCALE);
    }

    addBitmapText(x: number, y: number, s: string): Phaser.GameObjects.BitmapText {
        return this.add.bitmapText(x, y, ArcadeFont.key, s).setOrigin(0).setScale(1);
    }

    addBitmapTextByLine(x: number, line: number, s: string): Phaser.GameObjects.BitmapText {
        return this.add.bitmapText(x+4, 600-(32*line)-4, ArcadeFont.key, s).setOrigin(0, 1).setScale(1);
    }

    formatTimeString(t: number): string {
        return "t=" + t;
    }
}