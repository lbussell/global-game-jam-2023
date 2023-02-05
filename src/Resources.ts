
export enum TilemapLayer {
    Root = 'root',
    Water = 'water',
    Potassium = 'potassium',
    Dirt = 'dirt'
}

export interface TilemapObject {
    tilemapIndex: number,
    tilemapLayer: TilemapLayer
}

export interface ResourceTile extends TilemapObject {
    id: number,
    type: ResourceTileType,
    resourceQuantity: number,
    ratePerSec: number
}

export const Dirt: TilemapObject = {
    tilemapIndex: 17,
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

export const Water = (id: number, quantity: number, tileIndex : number): ResourceTile => {
    return {
        id: id,
        type: ResourceTileType.Water,
        tilemapIndex: tileIndex,
        resourceQuantity: quantity,
        ratePerSec: 1,
        tilemapLayer: TilemapLayer.Water
    }
}

export const Potassium = (id: number, quantity: number, tileIndex : number): ResourceTile => {
    return {
        id: id,
        type: ResourceTileType.Potassium,
        tilemapIndex: tileIndex,
        ratePerSec: 1,
        resourceQuantity: quantity,
        tilemapLayer: TilemapLayer.Potassium
    }
}

// export const Sunlight = (quantity: number): Resource => {
//     return {
//         tilemapIndex: 4,
//         resourceQuantity: quantity,
//         tilemapLayer: TilemapLayer.Resources
//     }
// }

// List of different tile patterns that water can spawn in
export const WaterConfigurations : number[][][] =
[
    // basic 4x4
    [[0, 3],
    [12, 15]]
];

export const PotassiumConfigurations : number[][][] =
[
    // basic 4x4
    [[82, 83, 84],
     [98, 99, 100],
     [114, 115, 116]]
];
