
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

export const Water = (quantity: number): ResourceTile => {
    return {
        type: ResourceTileType.Water,
        tilemapIndex: 0,
        resourceQuantity: quantity,
        ratePerSec: 1,
        tilemapLayer: TilemapLayer.Resources
    }
}

export const Potassium = (quantity: number): ResourceTile => {
    return {
        type: ResourceTileType.Potassium,
        tilemapIndex: 3,
        ratePerSec: 1,
        resourceQuantity: quantity,
        tilemapLayer: TilemapLayer.Resources
    }
}

// export const Sunlight = (quantity: number): Resource => {
//     return {
//         tilemapIndex: 4,
//         resourceQuantity: quantity,
//         tilemapLayer: TilemapLayer.Resources
//     }
// }
