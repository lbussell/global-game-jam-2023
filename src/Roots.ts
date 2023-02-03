import Phaser from "phaser";
import * as Constants from './Constants';
import Underground from './Underground';
import {
  Size,
  Position,
} from './Constants';
import { RootSprite } from './Assets';

export default class Root {
    private _lastPoints: Phaser.Math.Vector2[];
    private _allPoints: Phaser.Math.Vector2[];
    private _scene: Phaser.Scene;
    private _underground: Underground;

    private _allRopes: Phaser.GameObjects.Rope[];

    private _growthDistance = 8;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2, underground: Underground) {
        this._scene = scene;
        this._underground = underground;

        // Create inital Roots (all ropes will contain this number of points)
        this._lastPoints = [];
        this._lastPoints.push(position);
        this._lastPoints.push(position.clone().add(new Phaser.Math.Vector2(0, this._growthDistance)));
        this._lastPoints.push(position.clone().add(new Phaser.Math.Vector2(0, this._growthDistance*2)));
        this._lastPoints.push(position.clone().add(new Phaser.Math.Vector2(0, this._growthDistance*3)));

        // Track all points in the "full" rope
        this._allPoints = [];
        this._allPoints.concat(this._lastPoints);

        // Track all ropes in the "full" rope
        this._allRopes = [];
        this._allRopes.push(scene.add.rope(0, 0, RootSprite.key, undefined, this._lastPoints, false));
    }

    // Attempts to add a new point to the end of the Roots
    // Returns True if the point was added
    // Returns False otherwise
    addPoint(worldPoint: Phaser.Math.Vector2): boolean {
        // Do not add point if distance is less than growth distance
        if (worldPoint.clone().subtract(this._lastPoints[this._lastPoints.length - 1]).lengthSq() < (this._growthDistance * this._growthDistance))
        {
            return false;
        }

        // Calculate normalized direction to create point in
        let direction = worldPoint
            .subtract(this._lastPoints[this._lastPoints.length - 1])
            .normalize()
            .scale(this._growthDistance);

        // Create new point
        let newHead = this._lastPoints[this._lastPoints.length - 1].clone().add(direction);

        // Get the tile the point will be inside! (Important for resource detection, blocking objects?)
        let tileObject = this._underground.getTilemapObjectAtWorldPos(newHead);
        if (tileObject != null)
        {
            console.log("Placing inside of a ", tileObject.tilemapIndex, " type tile!");
        }

        // Shift down all points in the "active" points array
        for (let i=0; i<this._lastPoints.length - 1; i++)
        {
            this._lastPoints[i] = this._lastPoints[i+1];
        }

        // Insert new point
        this._lastPoints[this._lastPoints.length - 1] = newHead;
        this._allPoints.push(newHead);

        // Create new rope using the current point set
        this._allRopes.push(this._scene.add.rope(0, 0, RootSprite.key, undefined, this._lastPoints, false));
        return true;
    }
}
