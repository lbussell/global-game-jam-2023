import Phaser from 'phaser';

import { Resources, ResourceTypeValue } from "./Constants"

// enum Resource {
//     water = "water",
//     carbon = "carbon", 
//     fertilizer = "fertilizer",
//     nitrogen = "nitrogen"
// }

export default class GameManager {

    public readonly branchParts: number;

    // resources
    public readonly resources: { [Key in ResourceTypeValue as string]: number } = { };

    constructor() {
        this.branchParts = 10;
        Resources.forEach(r => this.resources[r] = 0);
    }
}