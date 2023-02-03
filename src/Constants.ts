
export const TILE_SIZE: number = 8;
export const TILE_SCALE: number = 3;
export const WINDOW_SIZE: Size = { h: 600, w: 800 };

export const MAP_HEIGHT: number = 64;
export const MAP_WIDTH: number = 34;

export interface Size {
    h: number;
    w: number;
}

export interface Position {
    x: number;
    y: number;
}

export const Resources: string[] = ["water", "carbon", "fertilizer", "nitrogen"];

export type ResourceTypeValue = 'water' | 'nitrogen'