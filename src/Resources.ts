
export enum TilemapLayer {
    Root = 'root',
    Resources = 'resources',
    Dirt = 'dirt'
}

export interface TilemapObject {
    tilemapIndex: number,
    tilemapLayer: TilemapLayer
}

export interface Resource extends TilemapObject {
    resourceQuantity: number,
}

export const Dirt: TilemapObject = {
    tilemapIndex: 4,
    tilemapLayer: TilemapLayer.Dirt
};

export const Root: TilemapObject = {
    tilemapIndex: 2,
    tilemapLayer: TilemapLayer.Root
};

// 2 = red

export const Water = (quantity: number): Resource => {
    return {
        tilemapIndex: 0,
        resourceQuantity: quantity,
        tilemapLayer: TilemapLayer.Resources
    }
}

export const Potassium = (quantity: number): Resource => {
    return {
        tilemapIndex: 3,
        resourceQuantity: quantity,
        tilemapLayer: TilemapLayer.Resources
    }
}

export const Sunlight = (quantity: number): Resource => {
    return {
        tilemapIndex: 4,
        resourceQuantity: quantity,
        tilemapLayer: TilemapLayer.Resources
    }
}