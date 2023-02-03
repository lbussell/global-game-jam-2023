import Phaser from "phaser";
import * as Constants from './Constants';

import {
    Size,
    Position,
} from './Constants';

import {
    Dirt,
    Water,
    Nitrogen,
    Fertilizer,
    Carbon,
    Root,
    TilemapLayer
} from './Resources'

import { TestTiles } from './Assets';
import { TilemapObject } from "./Resources";

export default class Underground {
    private _tilemap: Phaser.Tilemaps.Tilemap;
    private _scene: Phaser.Scene;
    private _camera: Phaser.Cameras.Scene2D.Camera;
    private _seed: number;

    private _undergroundGrid: (TilemapObject | null)[][];

    constructor(scene: Phaser.Scene, camera: Phaser.Cameras.Scene2D.Camera, seed: number = 0) {
        this._scene = scene;
        this._camera = camera;
        this._seed = seed;

        this._tilemap = this._scene.make.tilemap({
            tileWidth: Constants.TILE_SIZE,
            tileHeight: Constants.TILE_SIZE,
            width: Constants.MAP_WIDTH,
            height: Constants.MAP_HEIGHT
        });

        const tiles = this._tilemap.addTilesetImage(TestTiles.key);

        const layerDirt = this._tilemap.createBlankLayer('dirt', tiles);
        const layerRoot = this._tilemap.createBlankLayer('root', tiles);
        const layerResources = this._tilemap.createBlankLayer('resources', tiles);

        layerDirt.setScale(Constants.TILE_SCALE);
        layerRoot.setScale(Constants.TILE_SCALE);
        layerResources.setScale(Constants.TILE_SCALE);

        layerDirt.fill(
            Dirt.tilemapIndex,
            /* tileX */ 0,
            /* tileY */ 0,
            Constants.MAP_WIDTH,
            Constants.MAP_HEIGHT
        );

        // initialize resources

        this._undergroundGrid = [];
        for (let r = 0; r < Constants.MAP_HEIGHT; r += 1) {
            this._undergroundGrid[r] = [];
            for (let c = 0; c < Constants.MAP_WIDTH; c += 1) {
                let result: TilemapObject | null = null;
                if (Math.random() < 0.1) {
                    result = Water(128);
                }

                this._undergroundGrid[r][c] = result;
            }
        }
        console.log(this._undergroundGrid);

        const rootOrigin: Position = { x: Math.floor(Constants.MAP_WIDTH / 2), y: 0 };
        layerRoot.putTileAt(Root.tilemapIndex, rootOrigin.x, rootOrigin.y, true);
        this._undergroundGrid[rootOrigin.y][rootOrigin.x] = Root;
        this.placeRoot(rootOrigin);
        // this._tilemap.on
    }

    // OUTDATED logic to add roots to GRID
    click(worldPoint: Phaser.Math.Vector2): boolean {
        const pos: Position = {
            x: this._tilemap.worldToTileX(worldPoint.x, undefined, this._camera),
            y: this._tilemap.worldToTileY(worldPoint.y, undefined, this._camera)
        };
        return this.placeRoot(pos);
    }

    drawGrid() {
        for (let r = 0; r < Constants.MAP_HEIGHT; r += 1) {
            for (let c = 0; c < Constants.MAP_WIDTH; c += 1) {
                let tileObject = this._undergroundGrid[r][c];

                if (tileObject) {
                    this._tilemap.putTileAt(tileObject.tilemapIndex, c, r, true, tileObject.tilemapLayer)
                }
            }
        }
    }

    isOutOfBounds(pos: Position): boolean {
        if (pos.x < 0 || pos.x >= Constants.MAP_WIDTH ||
            pos.y < 0 || pos.y >= Constants.MAP_HEIGHT)
            return true;

        return false;
    }

    getTilemapObjectAtWorldPos(position: Phaser.Math.Vector2): TilemapObject | null {
        let tilePosition = this._tilemap.worldToTileXY(position.x, position.y, undefined, undefined, this._camera);

        if (this.isOutOfBounds(tilePosition))
        {
            return null;
        }

        return this._undergroundGrid[tilePosition.x][tilePosition.y];
    }

    // OUTDATED logic to add roots to GRID
    placeRoot(pos: Position): boolean {
        // Verify adjacent root
        let isAdjacent: boolean = false;

        if (!this.isOutOfBounds({ y: pos.y, x: pos.x + 1 }) && this._undergroundGrid[pos.y][pos.x + 1] == Root) {
            isAdjacent = true;
        }
        if (!this.isOutOfBounds({ y: pos.y, x: pos.x - 1 }) && this._undergroundGrid[pos.y][pos.x - 1] == Root) {
            isAdjacent = true;
        }
        if (!this.isOutOfBounds({ y: pos.y + 1, x: pos.x }) && this._undergroundGrid[pos.y + 1][pos.x] == Root) {
            isAdjacent = true;
        }
        if (!this.isOutOfBounds({ y: pos.y - 1, x: pos.x }) && this._undergroundGrid[pos.y - 1][pos.x] == Root) {
            isAdjacent = true;
        }

        if (isAdjacent) {
            if (this._undergroundGrid[pos.y][pos.x] == null) {
                this._undergroundGrid[pos.y][pos.x] = Root;
            } else {
                return false;
            }
        }

        // Return true if the action was successful
        return isAdjacent;
    }


}
