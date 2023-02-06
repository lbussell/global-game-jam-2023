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
import { ShopItem, ActivateNormalRoot, UnlockGlassRoot } from "../ShopItems"

export default class UI extends Phaser.Scene {
    private _isLoaded: boolean;
    private _gameScene?: World;

    private _bottomRect?: Phaser.GameObjects.Rectangle;
    private readonly _bottomRectHeightInTiles: number = 3;
    private _rightRect?: Phaser.GameObjects.Rectangle;
    private readonly _rightRectWidthInTiles: number = 5;
    private _menuBGColor: number = 0x000000; // black
    
    private _isShopShowing: boolean;
    private readonly _shopEdgeOffset: number = 50;
    private _shopMenuRect?: Phaser.GameObjects.Rectangle;
    private _shopMenuBGColor: number = 0x444444; // Grey
    private _itemsBuilt: boolean = false;

    private _shopButtonSpacing: number = 5;
    private _shopButtonEdgeSize: number = 100;
    private _shopButtons: Phaser.GameObjects.Rectangle[];

    private _shopItems: ShopItem[];

    private _shopLockedAfforableColor: number = 0x6761fa;
    private _shopLockedAfforableHoverColor: number = 0x756ff2;
    private _shopLockedUnafforableColor: number = 0x190254;
    private _shopUnlockedColor: number = 0x50f299;
    private _shopUnlockedHoverColor: number = 0x7dfab5;
    private _shopActiveColor: number = 0xc7ff5e;

    private _sunText?: Phaser.GameObjects.BitmapText;
    private _waterText?: Phaser.GameObjects.BitmapText;
    private _potasText?: Phaser.GameObjects.BitmapText;
    private _glucoseText?: Phaser.GameObjects.BitmapText;

    private _padding: number = 8;

    constructor() {
        super("UIScene");
        this._isLoaded = false;
        this._isShopShowing = false;
        this._shopButtons = [];
        this._shopItems = [];
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

        const pad = TILE_SCALE*11;

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


        // Shop menu Logic
        this.input.keyboard.on('keydown-S', () => this.toggleShop());

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

        function numsToText(amt: number, increase: number): string {
            return amt.toFixed(0).toString() + "(+" + increase.toFixed(1).toString() + ")"
        }

        if (this._isLoaded) {
            this._sunText?.setText(numsToText(r.sunlight, r.sunlightCollectionRate - r.glucoseRate));
            this._potasText?.setText(numsToText(r.potassium, r.potassiumRate));
            this._waterText?.setText(numsToText(r.water, r.waterRate));
            this._glucoseText?.setText(numsToText(r.glucose, r.glucoseRate));

            if (this._isShopShowing)
            {
                this._shopItems.forEach((item, idx) => {
                    this.updateItemColor(item, this._shopButtons[idx]);
                })
            }
        }
    }

    // updateResourceUI(r: ResourceAmounts): void {
    //     if (this._isLoaded) {
    //         this._sunText?.setText(r.sunlightCollectionRate.toFixed(0).toString());
    //         this._potasText?.setText(r.potassium.toFixed(0).toString());
    //         this._waterText?.setText(r.water.toFixed(0).toString());
    //         this._glucoseText?.setText(r.glucose.toFixed(0).toString());
    //     }
    // }

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
    
    toggleShop(): void {
        if (!this._isShopShowing)
        {
            if (!this._itemsBuilt)
            {
                this._shopItems.push(ActivateNormalRoot(this._gameScene!!.gameManager!!));
                this._shopItems.push(UnlockGlassRoot(this._gameScene!!.gameManager!!));
                this._itemsBuilt = true;
            }

            this.showShop();
            this._isShopShowing = true;
            this._gameScene!!.blockPlacement = true;
        }
        else
        {
            this.hideShop();
            this._isShopShowing = false;
            this._gameScene!!.blockPlacement = false;
        }
    }

    showShop(): void {
        this._shopMenuRect = this.add.rectangle(
            this._shopEdgeOffset,
            this._shopEdgeOffset,
            WINDOW_SIZE.w - this._shopEdgeOffset * 2 - this._rightRectWidthInTiles*TILE_SIZE*TILE_SCALE,
            WINDOW_SIZE.h - this._shopEdgeOffset * 2,
            this._shopMenuBGColor
        ).setOrigin(0, 0);

        this._shopItems.forEach(item => {
            this.addItem(item);
        });
    }

    isShopShowing(): boolean {
        return this._isShopShowing;
    }

    addItem(item: ShopItem) {
        let row = Math.floor(this._shopButtons.length / (this._shopButtonEdgeSize + this._shopButtonSpacing));
        let column = this._shopButtons.length % (this._shopButtonEdgeSize + this._shopButtonSpacing);

        let button = this.add.rectangle(
            this._shopButtonSpacing + this._shopEdgeOffset + column * (this._shopButtonEdgeSize + this._shopButtonSpacing),
            this._shopButtonSpacing + this._shopEdgeOffset + row * (this._shopButtonEdgeSize + this._shopButtonSpacing),
            this._shopButtonEdgeSize,
            this._shopButtonEdgeSize,
            this._shopLockedUnafforableColor
        ).setOrigin(0, 0);

        this.updateItemColor(item, button);

        button.setInteractive();
        button.on('pointerover', () => {
            item.isHovered = true;
            this.updateItemColor(item, button);
        });

        button.on('pointerout', () => {
            item.isHovered = false;
            this.updateItemColor(item, button);
        });

        button.on('pointerdown', () => {
            // This is a purchase event
            if (!item.isUnlocked) {

                if (this.purchaseItem(item))
                {
                    item.isUnlocked = true;
                    item.onPurchase();
                    this.updateItemColor(item, button);
                }
            }
            // This is an activate event
            else if (!item.isActive) {
                item.isActive = true;

                // Deactivate other items in this group
                this._shopItems.forEach((otherItem, idx) => {
                    if (otherItem.itemGroup == item.itemGroup && otherItem.itemId != item.itemId) {
                        otherItem.isActive = false;
                        this.updateItemColor(otherItem, this._shopButtons[idx]);
                        otherItem.onDeactivate();
                    }
                });

                item.onActivate();
                this.updateItemColor(item, button);
            }
            
        });

        this._shopButtons.push(button);
    }

    purchaseItem(item: ShopItem): boolean {
        // Verify resources
        if (this._gameScene!!.gameManager!!.resourceAmounts.sunlight < item.sunCost
            || this._gameScene!!.gameManager!!.resourceAmounts.glucose < item.glucoseCost
            || this._gameScene!!.gameManager!!.resourceAmounts.potassium < item.potassiumCost
            || this._gameScene!!.gameManager!!.resourceAmounts.water < item.waterCost)
            {
                return false;
            }
        
        this._gameScene!!.gameManager!!.resourceAmounts.sunlight -= item.sunCost;
        this._gameScene!!.gameManager!!.resourceAmounts.glucose -= item.glucoseCost;
        this._gameScene!!.gameManager!!.resourceAmounts.potassium -= item.potassiumCost;
        this._gameScene!!.gameManager!!.resourceAmounts.water -= item.waterCost;

        return true;
    }

    updateItemColor(item: ShopItem, itemButton: Phaser.GameObjects.Rectangle) {
        if (item.isActive) {
            itemButton.fillColor = this._shopActiveColor;
            return;
        }

        if (item.isUnlocked) {
            if (item.isHovered) {
                itemButton.fillColor = this._shopUnlockedHoverColor;
            }
            else {
                itemButton.fillColor = this._shopUnlockedColor;
            }
        }
        else {
            if (this._gameScene!!.gameManager!!.resourceAmounts.sunlight < item.sunCost
                || this._gameScene!!.gameManager!!.resourceAmounts.glucose < item.glucoseCost
                || this._gameScene!!.gameManager!!.resourceAmounts.potassium < item.potassiumCost
                || this._gameScene!!.gameManager!!.resourceAmounts.water < item.waterCost)
                {
                    itemButton.fillColor = this._shopLockedUnafforableColor;
                }
            else 
            {
                if (item.isHovered) {
                    itemButton.fillColor = this._shopLockedAfforableHoverColor;
                }
                else {
                    itemButton.fillColor = this._shopLockedAfforableColor;
                }
            }
        }
    }

    hideShop(): void {
        this._shopMenuRect?.destroy();

        this._shopButtons.forEach(button => {
            button.destroy();
        });

        this._shopButtons = [];
    }
}