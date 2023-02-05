import Phaser from "phaser";
import { TILE_SCALE, WINDOW_SIZE } from "./Constants";
import { BranchSprite, LeavesSprite } from "./Assets";

type degrees = number;
type pixels = number;

export default class ProceduralTree {

    private _graphics: Phaser.GameObjects.Graphics;
    private _numTreelevels: number = 8;
    private _segmentHeight: number = 8 * TILE_SCALE;
    private _segmentFalloff: number = 0.90;
    private _leafScale: number = 0.8;

    constructor(private _scene: Phaser.Scene, x: number, y: number) {
        this._graphics = this._scene.add.graphics();
        // this.drawLine([WINDOW_SIZE.w/2, 0], [WINDOW_SIZE.w/2,WINDOW_SIZE.h/2-100]);
        this.branch(
            this._numTreelevels,
            [WINDOW_SIZE.w / 2, 0],
            // 10 + this.randomizeAngle(), 
            0 + this.randomizeAngle(),
            this._segmentHeight
        );
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

    private randomizeAngle() {
        return (-0.5 + Math.random()) * 25;
    }

    private randomizeLen() {
        return (0.9 + (Math.random() * 0.2));
    }

    private branch(level: number, start: [number, number], angle: degrees, length: number) {
        // console.log('here');
        const end = this.line(start, angle, length, level);
        if (level <= 0) return;

        if (Math.random() < 0.8 || true) {
            this.branch(
                level - 1,
                end,
                angle - 25 + this.randomizeAngle(),
                length * this._segmentFalloff * this.randomizeLen()
            );
        }

        this.branch(
            level - 1,
            end,
            angle + 25 + this.randomizeAngle(),
            length * this._segmentFalloff * this.randomizeLen()
        );

        if (Math.random() < 0.7 && false) {
            this.branch(
                level - 2, 
                end,
                // angle + 45 + this.randomizeAngle(),
                angle + 25 + this.randomizeAngle(),
                length * this._segmentFalloff * this.randomizeLen()
            );
        }
    }

    private drawLine(
        start: [number, number],
        end: [number, number],
        len: number,
        dir_rad: number,
        level: number
    ) {
        // const group = this._scene.add.group({ key: BranchSprite.key, frameQuantity: 300 })
        // const dist = Math.sqrt(
        //     Math.pow(end[0]-start[0], 2)
        //     + Math.pow(end[1]-start[1], 2));
        if (level > 0) {
            this._scene.add.sprite(start[0], start[1], BranchSprite.key)
                .setOrigin(0.5, 0)
                .setScale(-(level / this._numTreelevels * 0.5) * TILE_SCALE, len / 8)
                .setRotation(dir_rad);
        } else {
            const midpoint = [
                (end[0] + start[0]) / 2,
                (end[1] + start[1]) / 2,
            ]
            this._scene.add.sprite(midpoint[0], midpoint[1], LeavesSprite.key)
                .setOrigin(0.5, 0.5)
                .setScale(this._leafScale * TILE_SCALE * this.randomizeLen())
        }

        // Phaser.Actions.PlaceOnLine(group.getChildren(), line);
        // this._graphics.lineStyle(100, 0x00ff00);
        // this._graphics.strokeLineShape(line);
        // this._scene.
    }
}
