const m = 0.002;
const DEPTH_OFFSET = 500;

export default class AudioManager {
    public _camera: Phaser.Cameras.Scene2D.Camera;
    public _scene: Phaser.Scene;

    private audioLoops: Phaser.Sound.BaseSound[] = [];
    private groundLevelScrollValue: number;

    private aboveGround: Phaser.Sound.BaseSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;
    private underGround: Phaser.Sound.BaseSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound;

    private paused: boolean = false;

    constructor(scene: Phaser.Scene, loopsToAdd: string[], sfxToAdd: string[]){
        this._camera = scene.cameras.main;
        this._scene = scene;
        this.groundLevelScrollValue = scene.cameras.main.scrollY;
        loopsToAdd.forEach(
            assetKey => {
                this.audioLoops.push(scene.sound.add(assetKey, { loop: true }));
            });
        sfxToAdd.forEach(
            assetKey => {
                scene.sound.add(assetKey)
            }
        )

        this.aboveGround = scene.sound.get('aboveground');
        this.underGround = scene.sound.get('underground');
        if (this.aboveGround.markers['aloop'] == null || this.aboveGround.markers['aloop'] == undefined) {
            this.aboveGround.addMarker({name: 'aloop', duration: 33.39})
        }
        if (this.aboveGround.markers['uloop'] == null || this.aboveGround.markers['uloop'] == undefined) {
            this.underGround.addMarker({name: 'uloop', duration: 33.39})
        }
    }

    public playLoops() {
        if (!this.underGround.isPlaying)
            this.underGround.play('uloop', { loop: true });
        if (!this.aboveGround.isPlaying)
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

    public playSFX(name: string){
        const sound = this._scene.sound.get(name);
        sound.play();
    }


}