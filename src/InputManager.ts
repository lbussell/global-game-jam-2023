import Phaser from "phaser";

export default class InputManager {
    public space: Phaser.Input.Keyboard.Key // idk debugging
    public tabKey: Phaser.Input.Keyboard.Key // move camera
    public pKey: Phaser.Input.Keyboard.Key // pause
    public lKey: Phaser.Input.Keyboard.Key // level up (for debug purposes)
    public mouse: Phaser.Input.Mouse.MouseManager

    constructor(private _scene: Phaser.Scene) {
        this.mouse = this._scene.input.mouse;
        this.space = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.tabKey = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
        this.pKey = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
        this.lKey = this._scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
    }
}