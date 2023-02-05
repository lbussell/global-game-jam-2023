import * as Constants from './Constants';
import {
    Position
} from './Constants';

const OVERWORLD_CAM_POINT: Position = {
    x: Constants.MAP_WIDTH * Constants.TILE_SIZE * Constants.TILE_SCALE / 2,
    y: -Constants.WINDOW_SIZE.h/2 + 128
}

const UNDERWORLD_CAM_POINT: Position = {
    x: Constants.MAP_WIDTH * Constants.TILE_SIZE * Constants.TILE_SCALE / 2,
    y: Constants.WINDOW_SIZE.h/2 - 100
}

export default class CameraManager {
    // public currentPos: Position;
    public currentPos: Phaser.GameObjects.Rectangle;

    public _camera: Phaser.Cameras.Scene2D.Camera;
    private _cameraMoveAmt: number = 40;
    private _cameraMoveTime: number = 300;
    private _cameraMoveType: string = 'Power2';
    private _inOverworld: boolean;

    constructor(scene: Phaser.Scene) { 
        this._camera = scene.cameras.main;
        this.currentPos = scene.add.rectangle(
            OVERWORLD_CAM_POINT.x,
            OVERWORLD_CAM_POINT.y,
            0,
            0
        );

        this._inOverworld = true;
        this._camera.setZoom(1);
        this._camera.centerOn(OVERWORLD_CAM_POINT.x, OVERWORLD_CAM_POINT.y);
        this.FocusOnOverworld();
        this._camera.startFollow(
            this.currentPos,
            false,
            0.1,
            0.1
        );
    }

    public MoveCameraUp() {
        const newPos: Position = {
            x: this.currentPos.x,
            y: this.currentPos.y + this._cameraMoveAmt
        }
        this.Pan(newPos);
    }

    public MoveCameraDown() {
        const newPos: Position = {
            x: this.currentPos.x,
            y: this.currentPos.y - this._cameraMoveAmt
        }
        this.Pan(newPos);
    }

    public SwapCameraPos() {
        if (!this._inOverworld) {
            this.FocusOnOverworld();
        } else {
            this.FocusOnUnderworld();
        }
    }

    public FocusOnOverworld() {
        // this._scene.cameras.main.centerOn(UNDERWORLD_CAM_POINT.x, UNDERWORLD_CAM_POINT.y);
        this.Pan(OVERWORLD_CAM_POINT);
        this._inOverworld = true;
    }

    public FocusOnUnderworld() {
        this.Pan(UNDERWORLD_CAM_POINT);
        this._inOverworld = false;
    }

    private Pan(to: Position) {
        // this._camera.pan(
        // // this._scene.cameras.main.centerOn(
        //     to.x,
        //     to.y,
        //     this._cameraMoveTime,
        //     this._cameraMoveType
        // );
        this.currentPos.x = to.x;
        this.currentPos.y = to.y;
    }
}