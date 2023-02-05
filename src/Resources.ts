export enum TilemapLayer {
    Root = 'root',
    Resources = 'resources',
    Dirt = 'dirt'
}

export interface TilemapObject {
    tilemapIndex: number,
    tilemapLayer: TilemapLayer
}

export interface ResourceTile extends TilemapObject {
    type: ResourceTileType,
    resourceQuantity: number,
    ratePerSec: number
}

export const Dirt: TilemapObject = {
    tilemapIndex: 4,
    tilemapLayer: TilemapLayer.Dirt
};

export const Root: TilemapObject = {
    tilemapIndex: 2,
    tilemapLayer: TilemapLayer.Root
};

export enum ResourceTileType {
    Water = "water",
    Potassium = "potassium"
}

// 2 = red

export const Water = (quantity: number, tileIndex : number): ResourceTile => {
    return {
        type: ResourceTileType.Water,
        tilemapIndex: tileIndex,
        resourceQuantity: quantity,
        ratePerSec: 1,
        tilemapLayer: TilemapLayer.Resources
    }
}

export const Potassium = (quantity: number): ResourceTile => {
    return {
        type: ResourceTileType.Potassium,
        tilemapIndex: 5,
        ratePerSec: 1,
        resourceQuantity: quantity,
        tilemapLayer: TilemapLayer.Resources
    }
}

export const WaterConfigurations : number[][][] =
[
    // basic 4x4
    [[0, 3],
    [12, 15]]
];
