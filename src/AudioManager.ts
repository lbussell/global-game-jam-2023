import * as Constants from './Constants';

//constants for logistic func
const X0 = 0;
const k = 1; //steepness

const m = 0.005;
const DEPTH_OFFSET = 100;

export default class AudioManager {
    public _camera: Phaser.Cameras.Scene2D.Camera;
    public _scene: Phaser.Scene;

    private audioLoops: Phaser.Sound.BaseSound[] = [];
    private groundLevelScrollValue: number;

    private aboveGround: any;
    private underGround: any;

    private paused: boolean = false;

    constructor(scene: Phaser.Scene, loopsToAdd: string[]){
        this._camera = scene.cameras.main;
        this._scene = scene;
        this.groundLevelScrollValue = scene.cameras.main.scrollY;
        loopsToAdd.forEach(
            assetKey => {
                this.audioLoops.push(scene.sound.add(assetKey, { loop: true }));
            });

        this.aboveGround = scene.sound.get('aboveground');
        this.underGround = scene.sound.get('underground');
        this.aboveGround.addMarker({name: 'aloop', duration: 33.39})
        this.underGround.addMarker({name: 'uloop', duration: 33.39})
    }

    public playLoops() {
        this.underGround.play('uloop', { loop: true });
        this.aboveGround.play('aloop', { loop: true });

    }

    public interpolateVolume(){
        const currentDepth = this.groundLevelScrollValue - this._camera.scrollY + DEPTH_OFFSET;

        this.aboveGround.setVolume(Phaser.Math.Clamp(m*currentDepth + 1, 0.01, 1));
        this.underGround.setVolume(Phaser.Math.Clamp((-m)*currentDepth + 1, 0.01, 1));
    }

    public toggleMuteAll() {
        this.paused ? this.audioLoops.forEach(loop => loop.resume()) : this.audioLoops.forEach(loop => loop.pause());
        this.paused = !this.paused;
    }


}