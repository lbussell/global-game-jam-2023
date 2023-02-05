import Phaser from "phaser";
import * as Constants from './Constants';

import {
    Size,
    Position,
} from './Constants';

import {
    Dirt,
    Water,
    Root,
    Potassium,
    TilemapLayer,
    ResourceTile,
    ResourceTileType
} from './Resources'

import {
    TestTiles,
    WaterTiles,
    PotassiumTiles,
    GroundTiles
} from './Assets';

import { TilemapObject } from "./Resources";
import  MapGenerator, { ResourceGenerationData} from "./MapGenerator";

export default class Underground {
    private _tilemap: Phaser.Tilemaps.Tilemap;
    private _scene: Phaser.Scene;
    private _camera: Phaser.Cameras.Scene2D.Camera;
    private _seed: number;

    private _undergroundGrid: (ResourceTile | null)[][];

    private _undergroundMapGenerator : MapGenerator;

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

        const tiles = this._tilemap.addTilesetImage(GroundTiles.key);
        const waterTiles = this._tilemap.addTilesetImage(WaterTiles.key);
        const potassiumTiles = this._tilemap.addTilesetImage(PotassiumTiles.key);

        const layerDirt = this._tilemap.createBlankLayer('dirt', tiles);
        const layerWater = this._tilemap.createBlankLayer('water', waterTiles);
        const layerPotassium = this._tilemap.createBlankLayer("potassium", potassiumTiles)

        layerDirt.setScale(Constants.TILE_SCALE);
        layerWater.setScale(Constants.TILE_SCALE);
        layerPotassium.setScale(Constants.TILE_SCALE);

        layerDirt.fill(
            Dirt.tilemapIndex,
            /* tileX */ 0,
            /* tileY */ 0,
            Constants.MAP_WIDTH,
            Constants.MAP_HEIGHT
        );

        layerDirt.randomize(
            /* tileX */ 0,
            /* tileY */ 0,
            Constants.MAP_WIDTH,
            1,
            [1,2,3]
        );

        layerDirt.randomize(
            /* tileX */ 0,
            /* tileY */ 1,
            Constants.MAP_WIDTH,
            1,
            [9,10,11]
        );

        // initialize map generator and generate grid
        var generationData = new Map<ResourceTileType, ResourceGenerationData>();
        generationData.set(ResourceTileType.Water, new ResourceGenerationData(0.05, 0.005, 1, 5));
        generationData.set(ResourceTileType.Potassium, new ResourceGenerationData(0.1, 0.001, 3, 10));

        this._undergroundMapGenerator = new MapGenerator(scene, 
            new Phaser.Math.Vector2(Constants.MAP_WIDTH, Constants.MAP_HEIGHT),
            generationData, Math.random(), 4);

        this._undergroundGrid = this._undergroundMapGenerator.GenerateMap();
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

    getResourceTileAtWorldPos(position: Phaser.Math.Vector2): ResourceTile | null {
        let tilePosition = this._tilemap.worldToTileXY(position.x, position.y, undefined, undefined, this._camera);

        if (this.isOutOfBounds(tilePosition))
        {
            return null;
        }

        return this._undergroundGrid[tilePosition.y][tilePosition.x];
    }
}
