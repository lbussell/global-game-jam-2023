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
    private _upAngleRestriction = Math.PI / 2;

    private _upVector = new Phaser.Math.Vector2(0, -1);
    private _leftVector = new Phaser.Math.Vector2(-1, 0);
    private _rightVector = new Phaser.Math.Vector2(1, 0);

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
        this._allPoints = this._allPoints.concat(this._lastPoints);

        this._ghostPoints = [];


        // Track all ropes in the "full" rope
        this._allRopes = [];
        this._allRopes.push(scene.add.rope(0, 0, RootSprite.key, undefined, this._lastPoints, false));
    }

    // Returns closest point of the root to the given point, and its direction vector
    // TODO: Favors existing root ends
    // TODO: Returns undefinied direction if the closest point is a new branch
    getClosestPoint(worldPoint: Phaser.Math.Vector2): [Phaser.Math.Vector2, Phaser.Math.Vector2 | undefined] {
        if (this._allPoints.length < 1)
        {
            return [new Phaser.Math.Vector2(0, 0), undefined]
        }


        let closestPoint: Phaser.Math.Vector2 = this._allPoints[0];
        let closestPointDirection: Phaser.Math.Vector2 | undefined = undefined;
        let closestPointDistance = worldPoint.distanceSq(closestPoint);

        for (let i=1; i<this._allPoints.length; i++)
        {
            // Cannot move upwards, so only consider points on or above the current level
            if (worldPoint.y < this._allPoints[i].y)
            {
                continue;
            }

            // Check if closer to this point
            if (worldPoint.distanceSq(this._allPoints[i]) < closestPointDistance)
            {
                closestPoint = this._allPoints[i];
                closestPointDirection = this._allPoints[i].clone().subtract(this._allPoints[i- 1]).normalize();
                closestPointDistance = worldPoint.distanceSq(closestPoint);
            }
        }

        return [closestPoint,
            closestPointDirection];
    }

    findAndDrawBestGhost(worldPoint: Phaser.Math.Vector2): boolean {
        if (this._allPoints.length < 1)
        {
            return false;
        }

        let bestPoints: Phaser.Math.Vector2[] = [];
        let bestPointsDistance = 1000000;

        for (let i=1; i<this._allPoints.length; i++)
        {
            // Cannot move upwards, so only consider points on or above the current level
            if (worldPoint.y < this._allPoints[i].y)
            {
                continue;
            }

            // Check if starting at this points gets closer
            let currentStart = this._allPoints[i];
            let currentStartDirection = this._allPoints[i].clone().subtract(this._allPoints[i- 1]).normalize();
            let points = this.getGhostPointsTo(worldPoint, currentStart, currentStartDirection);
            let distance = worldPoint.distanceSq(points[points.length - 1]);

            // If we already have a perfect route, find the shorter one
            if (bestPointsDistance < this._growthDistance * this._growthDistance 
                && distance < this._growthDistance * this._growthDistance
                && points.length < bestPoints.length)
            {
                bestPoints = points;
                bestPointsDistance = worldPoint.distanceSq(points[points.length - 1]);
            }
            // If we don't have a perfect route, find closer
            else if (distance < bestPointsDistance)
            {
                bestPoints = points;
                bestPointsDistance = worldPoint.distanceSq(points[points.length - 1]);
            }
        }

        this.drawGhost(bestPoints);

        return true;
    }

    drawGhost(points: Phaser.Math.Vector2[]): void {
        // Cannot draw if we don't have at least 2 points
        if (points.length < 2)
        {
            return;
        }

        // Clear ghost ropes
        if (this._ghostRope != undefined)
        {
            this._ghostRope.destroy();
        }

        this._ghostPoints = points;

        // Set colors
        let colors = []
        for (let i=0; i<this._ghostPoints.length; i++)
        {
            colors.push(this._ghostColor);
        }

        // Draw Ghost rope
        this._ghostRope = this._scene.add.rope(0, 0, RootSprite.key, undefined, points, false, colors);
    }

    // Draws a ghost of root to the given position
    getGhostPointsTo(worldPoint: Phaser.Math.Vector2, startPoint: Phaser.Math.Vector2, startDirection: Phaser.Math.Vector2): Phaser.Math.Vector2[] {
        let points = [];
        points.push(startPoint);

        let currentDirection = startDirection;

        let lastDistance = 100000;

        // Build ghost points
        while (points.length < this._maxGhosts && points[points.length - 1].distance(worldPoint) > this._growthDistance)
        {
            let direction = points[points.length-1].clone()
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

            
            angle = Math.acos(direction.clone().dot(this._upVector));
            // Do not allow up-ward roots
            if (angle < this._upAngleRestriction)
            {
                if (Math.acos(direction.clone().dot(this._rightVector)) < Math.acos(direction.clone().dot(this._leftVector)))
                {
                    direction = this._rightVector;
                }
                else
                {
                    direction = this._leftVector;
                }
            }

            // Add point and update direction
            let newPoint = points[points.length - 1].clone().add(direction);

            // Do not add new point if we are getting further from the desired point
            if (newPoint.distanceSq(worldPoint) > lastDistance)
            {
                break;
            }
            else
            {
                lastDistance = newPoint.distanceSq(worldPoint)
            }

            points.push(newPoint)
            currentDirection = direction;
        }
        
        return points;
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
        this._allPoints = this._allPoints.concat(this._lastPoints);

        // Create new rope using the current point set
        this._allRopes.push(this._scene.add.rope(0, 0, RootSprite.key, undefined, this._lastPoints, false));
        return true;
    }
}
