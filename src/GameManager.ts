import Phaser from 'phaser';
import { ResourceTile, ResourceTileType, Water, Potassium } from './Resources';

export interface ResourceAmounts {
    sunlightCollectionRate: number,
    water: number,
    potassium: number,
    glucose: number
}

export default class GameManager {

    private _basePhotosynthesisRate = 0.2;
    private _photosynthesisRateMultiplier = 1;
    private _baseGatherRate = 0.2;
    private _gatherRateMultiplier = 1;

    private attachedResources: ResourceTile[] = [];

    public resourceAmounts: ResourceAmounts = {
        sunlightCollectionRate: 0,
        water: 0,
        potassium: 0,
        glucose: 0
    }

    constructor() {
        this.resourceAmounts = {
            sunlightCollectionRate: 2,
            water: 0,
            potassium: 0,
            glucose: 0
        }

        // start with some fake attached resources until we actually hook them up in the game
        this.attachedResources = [
            Water(128), Water(128), Water(128),
            Potassium(128), Potassium(128)
        ];
    }

    public updateAttachedResources(dt: number) {
        dt = dt/1000;

        // grab resources from the ground
        this.attachedResources.forEach(r => {
            if (r.resourceQuantity > 0) {

                let toAdd = 
                    r.ratePerSec
                    * this._gatherRateMultiplier
                    * this._baseGatherRate
                    * dt;

                let left = r.resourceQuantity - toAdd;

                if (left <= 0) {
                    left = 0;
                    toAdd = r.resourceQuantity;
                }

                r.resourceQuantity = left;

                switch (r.type) {
                    case ResourceTileType.Water:
                        this.resourceAmounts.water += toAdd;
                        return;
                    case ResourceTileType.Potassium:
                        this.resourceAmounts.potassium += toAdd;
                        return;
                }
            }
        });

        // convert sunlight into glucose via photosynthesis
        this.resourceAmounts.glucose += 
            this.resourceAmounts.sunlightCollectionRate 
            * this._basePhotosynthesisRate
            * this._photosynthesisRateMultiplier
            * dt;
    }

    public attachTo(tile: ResourceTile) {
        this.attachedResources.push(tile);
    }
}