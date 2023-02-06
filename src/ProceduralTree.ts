import Phaser from "phaser";
import { TILE_SCALE, WINDOW_SIZE } from "./Constants";
import { BranchSprite, LeavesSprite, LeavesSprites } from "./Assets";

type degrees = number;
type pixels = number;

interface LeafSprite {
    origin: [number, number],
    offset: number, // in rad, i guess
    sprite: Phaser.GameObjects.Sprite
}

export default class ProceduralTree {
    
    public level: number = 0;

    // these change during gameplay
    private _branches: Phaser.GameObjects.Sprite[] = [];
    private _leaves: LeafSprite[] = [];

    // wind tuning
    private _windTimeScale: number = 1000;
    private _windScale: number = 10;
    private _windMovementScale: number = 6;

    // how tall the first branch/trunk segment is
    private readonly _segmentHeight = () => 8 * TILE_SCALE * this.level * 0.5;
    // how much progressively shorter each segment gets
    private readonly _segmentFalloff = () => 0.90;

    // how many segments to have
    private readonly _depthIterations = () => 1 + this.level;
    // how big to scale the leaf sprites
    private readonly _leafScale = () => 0.4 + 0.2* this.level;
    // how big to scale the branch sprites
    private readonly _branchScale = (depth: number) => -(depth / this._depthIterations() * 0.5) * TILE_SCALE;

    // for debugging purposes
    private readonly _drawLeaves: boolean = true;
    private readonly _drawBranches: boolean = true;

    constructor(private _scene: Phaser.Scene, x: number, y: number) {
        // this.branch(
        //     this._depthIterations(),
        //     [WINDOW_SIZE.w / 2, 0],
        //     // 10 + this.randomizeAngle(), 
        //     0 + this.randomizeAngle(),
        //     this._segmentHeight()
        // );
        // this.generateNewTree();
        this.levelUp();
    }

    public levelUp() {
        this.level += 1;
        this.clearSprites();
        this.generateNewTree();
        console.log(this._leaves)
    }

    private line(start: [number, number], direction: degrees, length: number, level: number): [number, number] {
        const dir_rad = direction * (Math.PI / 180);
        const end: [number, number] = [
            start[0] + length * Math.sin(dir_rad),
            start[1] - length * Math.cos(dir_rad),
        ];
        this.drawLine(start, end, length, dir_rad + Math.PI, level);
        return end;
    }

    private branch(depth: number, start: [number, number], angle: degrees, length: number) {
        const end = this.line(start, angle, length, depth);
        if (depth <= 0) return;

        if (Math.random() < 0.8 || true) {
            this.branch(
                depth - 1,
                end,
                angle - 25 + this.randomizeAngle(),
                length * this._segmentFalloff() * this.randomizeLen()
            );
        }

        this.branch(
            depth - 1,
            end,
            angle + 25 + this.randomizeAngle(),
            length * this._segmentFalloff() * this.randomizeLen()
        );

        if (Math.random() < 0.7 && false) {
            this.branch(
                depth - 2, 
                end,
                // angle + 45 + this.randomizeAngle(),
                angle + 25 + this.randomizeAngle(),
                length * this._segmentFalloff() * this.randomizeLen()
            );
        }
    }

    public animateLeaves(t: number): void {
        // this._windTimeScale = 
        // const timeScale = this._windTimeScale + Math.sin(t/this._windTimeScale)*this._windTimeScale/4;
        const timeScale = this._windTimeScale;
        t = t/timeScale;
        const movScale = this._windMovementScale + Math.sin(t)*this._windMovementScale/4;
        this._leaves.forEach(leafSprite => {
           leafSprite.sprite.setPosition(
                leafSprite.origin[0] 
                    + movScale * Math.sin(t + leafSprite.offset * Math.PI * 2),
                leafSprite.origin[1]
                    + movScale * Math.cos(t + leafSprite.offset * Math.PI * 2) / 3
           ) 
        });
    }

    private drawLine(
        start: [number, number],
        end: [number, number],
        len: number,
        dir_rad: number,
        depth: number
    ) {
        if (depth > 0 && this._drawBranches) {
            this._branches.push(
                this._scene.add.sprite(start[0], start[1], BranchSprite.key)
                    .setOrigin(0.5, 0)
                    .setScale(this._branchScale(depth), len / 8)
                    .setRotation(dir_rad)
            );
        } else if (this._drawLeaves) {
            const midpoint: [number, number] = [
                (end[0] + start[0]) / 2,
                (end[1] + start[1]) / 2,
            ]
            const leaf: LeafSprite = {
                sprite: this._scene.add.sprite(midpoint[0], midpoint[1], LeavesSprites.key, Phaser.Math.Between(0, LeavesSprites.numSprites-1))
                    .setOrigin(0.5, 0.5)
                    .setScale(this._leafScale() * TILE_SCALE * this.randomizeLen()),
                origin: midpoint,
                offset: Math.random()
            }
            this._leaves.push(leaf);
        }
    }

    private clearSprites() {
        this._leaves.forEach(s => s.sprite.destroy(true))
        this._branches.forEach(s => s.destroy(true))
        this._leaves = [];
        this._branches = [];
    }

    private generateNewTree() {
        this.branch(
            this._depthIterations(),
            [WINDOW_SIZE.w / 2, 0],
            // 10 + this.randomizeAngle(), 
            0 + this.randomizeAngle(),
            this._segmentHeight()
        );
    }

    private randomizeAngle() {
        return (-0.5 + Math.random()) * 25;
    }

    private randomizeLen() {
        return (0.9 + (Math.random() * 0.2));
    }
}
