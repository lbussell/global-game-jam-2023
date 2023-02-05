import Phaser from "phaser";
import { ParticleSprite } from "./Assets";
import { TILE_SCALE } from "./Constants";

export default class ParticleManaager {
    private _emitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];

    private readonly _speed: number = 400;

    constructor(private _scene: Phaser.Scene) {
        this._emitters.push(this._scene.add.particles(ParticleSprite.key).createEmitter({
            x: -1000,
            y: 1000,
            speed: { min: -this._speed, max: this._speed },
            angle: { min: 0, max: 360 },
            scale: { start: TILE_SCALE, end: 0 },
            blendMode: 'SCREEN',
            active: true,
            lifespan: 300,
            gravityY: 0
        }));

        this._emitters.push(this._scene.add.particles(ParticleSprite.key).createEmitter({
            x: -1000,
            y: 1000,
            speed: { min: -this._speed, max: this._speed },
            angle: { min: 0, max: 360 },
            scale: { start: TILE_SCALE, end: 0 },
            blendMode: 'SCREEN',
            active: true,
            lifespan: 600,
            gravityY: 0
        }));

        // try and get them to shut up before the game starts
        this._emitters.forEach(e => e.explode(0, 9999, 9999));
    }

    public explode(x: number, y: number) {
        this._emitters.forEach(e => e.explode(1, x, y))
    }


}