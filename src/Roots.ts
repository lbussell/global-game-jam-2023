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
    private _ghostRope: Phaser.GameObjects.Rope | undefined = undefined;
    private _ghostPoints: Phaser.Math.Vector2[];
    private _ghostColor = Phaser.Display.Color.GetColor32(75, 180, 180, 150);

    private _growthDistance = 8;
    private _maxGhosts = 100;
    private _maxAngleRadians = 0.06;

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

        this._ghostPoints = [];

        // Track all ropes in the "full" rope
        this._allRopes = [];
        this._allRopes.push(scene.add.rope(0, 0, RootSprite.key, undefined, this._lastPoints, false));
    }

    // Returns closest point of the root to the given point, and its direction vector
    // TODO: Favors existing root ends
    // TODO: Returns undefinied direction if the closest point is a new branch
    getClosestPoint(worldPoint: Phaser.Math.Vector2): [Phaser.Math.Vector2, Phaser.Math.Vector2 | undefined] {
        return [this._lastPoints[this._lastPoints.length - 1],
            (this._lastPoints[this._lastPoints.length - 1].clone().subtract(this._lastPoints[this._lastPoints.length - 2])).normalize()];
    }

    // Draws a ghost of root to the given position
    ghostTo(worldPoint: Phaser.Math.Vector2): boolean {
        // Clear ghost ropes
        if (this._ghostRope != undefined)
        {
            this._ghostRope.destroy();
        }

        let closest = this.getClosestPoint(worldPoint);

        // TODO: Add maximum angle to branches? (From perpendicular)
        if (closest[1] == undefined)
        {
            closest[1] = closest[0].clone()
                .subtract(worldPoint)
                .normalize();
        }

        let currentDirection = closest[1].clone();

        this._ghostPoints = [];
        this._ghostPoints.push(closest[0].clone());

        // Build ghost points
        while (this._ghostPoints.length < this._maxGhosts && this._ghostPoints[this._ghostPoints.length - 1].distance(worldPoint) > 2)
        {
            let direction = this._ghostPoints[this._ghostPoints.length-1].clone()
                .subtract(worldPoint)
                .normalize();

            let angle = Math.acos(direction.clone().dot(currentDirection));

            // If this point is turning too far, limit turn
            if (angle > this._maxAngleRadians && Math.abs(angle - Math.PI * 2) > this._maxAngleRadians)
            {
                let testDir1 = new Phaser.Math.Vector2(
                    Math.cos(this._maxAngleRadians)*currentDirection.x - Math.sin(this._maxAngleRadians)*currentDirection.y,
                    Math.sin(this._maxAngleRadians)*currentDirection.x + Math.cos(this._maxAngleRadians)*currentDirection.y).normalize();
                
                let testDir2 = new Phaser.Math.Vector2(
                    Math.cos(2 * Math.PI - this._maxAngleRadians)*currentDirection.x - Math.sin(2 * Math.PI - this._maxAngleRadians)*currentDirection.y,
                    Math.sin(2 * Math.PI - this._maxAngleRadians)*currentDirection.x + Math.cos(2 * Math.PI - this._maxAngleRadians)*currentDirection.y).normalize();

                if (Math.acos(testDir1.clone().dot(direction)) > Math.acos(testDir2.clone().dot(direction)))
                {
                    direction = testDir1;
                }
                else
                {
                    direction = testDir2;
                }
            }

            // Add point and update direction
            this._ghostPoints.push(this._ghostPoints[this._ghostPoints.length - 1].clone().add(direction))
            currentDirection = direction;
        }

        // Set colors
        let colors = []
        for (let i=0; i<this._ghostPoints.length; i++)
        {
            colors.push(this._ghostColor);
        }

        // Draw Ghost rope
        this._ghostRope = this._scene.add.rope(0, 0, RootSprite.key, undefined, this._ghostPoints, false, colors);

        return true;
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

        // Insert new point
        this._lastPoints = this._ghostPoints;

        for (let i=0; i<this._lastPoints.length; i++)
        {
            this._allPoints.push(this._lastPoints[i]);
        }

        // Create new rope using the current point set
        this._allRopes.push(this._scene.add.rope(0, 0, RootSprite.key, undefined, this._lastPoints, false));
        return true;
    }
}
