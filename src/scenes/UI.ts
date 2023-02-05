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
import World from "./Game";
import { Potassium } from "../Resources";
import { ResourceAmounts } from "../GameManager";

export default class UI extends Phaser.Scene {
    private _isLoaded: boolean;
    private _gameScene?: World;

    private _bottomRect?: Phaser.GameObjects.Rectangle;
    private readonly _bottomRectHeightInTiles: number = 3;
    private _rightRect?: Phaser.GameObjects.Rectangle;
    private readonly _rightRectWidthInTiles: number = 3;
    private _menuBGColor: number = 0x000000; // black

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
        // we just know that this is type World
        this._gameScene = <World> this.scene.get("GameScene");

        const scaledTileSize = TILE_SIZE*TILE_SCALE;

        const menuTopLeftAnchor = WINDOW_SIZE.w - this._rightRectWidthInTiles*scaledTileSize;

        this._rightRect = this.add.rectangle(
            menuTopLeftAnchor, // x
            0, // y
            this._rightRectWidthInTiles*scaledTileSize, // w
            WINDOW_SIZE.h, // h,
            this._menuBGColor
        ).setOrigin(0, 0) // top left

        // math for placing text and other ui elements //

        const pad = TILE_SCALE*4;

        const sloty = (slot: number): number => pad + scaledTileSize*4*(slot-1);

        const addMenuIcon = (slot: number, sprite: Sprite): Phaser.GameObjects.Sprite => 
            this.addSprite(
                menuTopLeftAnchor + pad,
                sloty(slot),
                sprite);

        const addMenuText = (slot: number, text: string): Phaser.GameObjects.BitmapText =>
            this.addBitmapText(
                menuTopLeftAnchor + this._rightRectWidthInTiles*scaledTileSize/2,
                sloty(slot) + /* dist from slot top to text */ TILE_SCALE*18,
                text,
                0.5
            );

        addMenuIcon(1, SunIcon);
        this._sunText = addMenuText(1, "69");

        addMenuIcon(2, WaterIcon);
        this._waterText = addMenuText(2, "420");

        addMenuIcon(3, PotassiumIcon);
        this._potasText = addMenuText(3, "666");

        addMenuIcon(4, GlucoseIcon);
        this._glucoseText = addMenuText(4, "1337");

        // addMenuIcon(5, PotassiumIcon)
        // /* this._sunText = */ addMenuText(5, "9999");
        // addMenuIcon(6, PotassiumIcon)
        // /* this._sunText = */ addMenuText(6, "uwu");

        this._isLoaded = true;
    }
    
    update(time: number, delta: number): void {
        if (this._isLoaded && this._gameScene?.isLoaded) {
            if (this._gameScene.gameManager?.resourceAmounts != undefined) {
                this.updateResourceUI(this._gameScene.gameManager.resourceAmounts);
            }
        }
    }

    updateResourceUI(r: ResourceAmounts): void {
        if (this._isLoaded) {
            this._sunText?.setText(r.sunlightCollectionRate.toFixed(0).toString());
            this._potasText?.setText(r.potassium.toFixed(0).toString());
            this._waterText?.setText(r.water.toFixed(0).toString());
            this._glucoseText?.setText(r.glucose.toFixed(0).toString());
        }
    }

    addSprite(x: number, y: number, s: Sprite) {
        return this.add.sprite(x, y, s.key).setOrigin(0, 0).setScale(TILE_SCALE);
    }

    addBitmapText(x: number, y: number, s: string, originx: number = 0, originy: number = 0): Phaser.GameObjects.BitmapText {
        return this.add.bitmapText(x, y, ArcadeFont.key, s)
            .setOrigin(originx, originy)
            .setScale(1)
            .setFontSize(TILE_SCALE * 5);
    }

    addBitmapTextByLine(x: number, line: number, s: string): Phaser.GameObjects.BitmapText {
        return this.add.bitmapText(x+4, 600-(32*line)-4, ArcadeFont.key, s).setOrigin(0, 1).setScale(1);
    }

    formatTimeString(t: number): string {
        return "t=" + t;
    }
}