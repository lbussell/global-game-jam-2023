import Phaser from 'phaser';

export default class GameManager {

    // building materials
    public branchParts: number = 0;

    // resources
    public nitrogen: number = 0;
    public water: number = 0;
    public oxygen: number = 0;
    public fertilizer: number = 0;

    constructor() {
        this.branchParts = 10;
    }

    // public getDebugInfo
}