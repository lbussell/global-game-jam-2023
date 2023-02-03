import { Size, TILE_SIZE } from "./Constants";

export interface Asset {
    key: string;
    assetLocation: string;
}

export interface SpriteSheet extends Asset {
    numSprites: number,
    size: Size
}

export interface Sprite extends Asset {
}

export interface Font extends Asset {
    xmlLocation: string;
};

export const TestTiles: SpriteSheet = {
    key: "testTiles",
    assetLocation: "assets/testTiles.png",
    numSprites: 5,
    size: { h: TILE_SIZE, w: TILE_SIZE }
}

export const RootSprite: Sprite = {
    key: "root",
    assetLocation: "assets/testRoot3.png"
}

export const ArcadeFont: Font = {
    key: "arcadeFont",
    assetLocation: "assets/fonts/arcade.png",
    xmlLocation: "assets/fonts/arcade.xml"
}

export const AssetLoader = {
    loadFont: (scene: Phaser.Scene, font: Font) =>
        scene.load.bitmapFont(
            font.key,
            font.assetLocation,
            font.xmlLocation
        ),
    loadSpriteSheet: (scene: Phaser.Scene, ss: SpriteSheet) =>
        scene.load.spritesheet(
            ss.key,
            ss.assetLocation,
            { 
                frameWidth: ss.size.w,
                frameHeight: ss.size.h 
            }
        ),
    loadSprite: (scene: Phaser.Scene, s: Sprite) =>
        scene.load.image(
            s.key,
            s.assetLocation
        )
}