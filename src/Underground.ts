import Phaser from "phaser";
import * as Constants from './Constants';
import {
  Size,
  Position,
} from './Constants';
import { TestTiles } from './Assets';

export default class Underground {
    private _tilemap: Phaser.Tilemaps.Tilemap;
    private _scene: Phaser.Scene;
    private _seed: number;

    private _rootTileIndex: number;

    constructor(scene: Phaser.Scene, seed: number = 0) {
        this._scene = scene;
        this._seed = seed;
        this._rootTileIndex = 0;

        this._tilemap = this._scene.make.tilemap({ 
            tileWidth: Constants.TILE_SIZE,
            tileHeight: Constants.TILE_SIZE,
            width: 32,
            height: 32
        });

        const tiles = this._tilemap.addTilesetImage(TestTiles.key);

        const layerDirt = this._tilemap.createBlankLayer('dirt', tiles);
        const layerRoot = this._tilemap.createBlankLayer('root', tiles);
        layerDirt.setScale(Constants.TILE_SCALE);
        layerRoot.setScale(Constants.TILE_SCALE);

        layerDirt.fill(4, 0, 0, 32, 32);

        layerRoot.putTileAt(0, 0, 0, true);
        this._tilemap.putTileAt(this._rootTileIndex, 0, 1, true, 'root');

        const testPos: Position = { x: 0, y: 1 }
        this.placeRoot(testPos)
    }

    click(worldPoint: Phaser.Math.Vector2): boolean {
        const pos: Position = {
            x: this._tilemap.worldToTileX(worldPoint.x),
            y: this._tilemap.worldToTileY(worldPoint.y)
        };
        return this.placeRoot(pos);
    }

    placeRoot(pos: Position): boolean {
        // Verify adjacent root
        let isAdjacent:boolean = false;
        if (this._tilemap.getTileAt(pos.x + 1, pos.y, undefined, 'root') != null)
        {
            isAdjacent = true;
        }

        if (this._tilemap.getTileAt(pos.x - 1, pos.y, undefined, 'root') != null)
        {
            isAdjacent = true;
        }

        if (this._tilemap.getTileAt(pos.x, pos.y + 1, undefined, 'root') != null)
        {
            isAdjacent = true;
        }

        if (this._tilemap.getTileAt(pos.x, pos.y - 1, undefined, 'root') != null)
        {
            isAdjacent = true;
        }

        if (isAdjacent)
        {
            this._tilemap.putTileAt(this._rootTileIndex, pos.x, pos.y, true, 'root');
        }
        
        // Return true if the action was successful
        return isAdjacent;
    }
}
