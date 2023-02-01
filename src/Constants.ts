
export const TILE_SIZE: number = 8;
export const TILE_SCALE: number = 3;
export const WINDOW_SIZE: Size = { h: 600, w: 800 };

export interface Size {
    h: number;
    w: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface SpriteSheet extends Asset {
    numSprites: number
}

export interface Asset {
    key: string;
    location: string;
}

export const TestTiles: SpriteSheet = {
    key: "testTiles",
    location: "assets/testTiles.png",
    numSprites: 5
}
