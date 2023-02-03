import Phaser from "phaser";
import { ArcadeFont, AssetLoader } from "../Assets";

export default class UI extends Phaser.Scene {
    private _isLoaded: boolean;
    private _gameScene?: Phaser.Scene;

    private _padding: number = 8;

    constructor() {
        super("UIScene");
        this._isLoaded = false;
        Phaser.Scene.call(this, { key: "UIScene", active: true });
    }

    preload() {
        // this.load.bitmapFont(font.key, font.assetLocation, font.xmlLocation);
        AssetLoader.loadFont(this, ArcadeFont);
    }

    create() {
        this.addBitmapText(0, 0, "ayy lmao");
        this._gameScene = this.scene.get("GameScene");
        this._isLoaded = true;
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