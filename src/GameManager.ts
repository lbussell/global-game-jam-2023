import Phaser from 'phaser';
import ProceduralTree from './ProceduralTree';
import { ResourceTile, ResourceTileType, Water, Potassium } from './Resources';

export interface ResourceAmounts {
    sunlight: number,
    sunlightCollectionRate: number,
    water: number,
    waterRate: number,
    potassium: number,
    potassiumRate: number,
    glucose: number,
    glucoseRate: number
}

export default class GameManager {

    public get treeLevel() {
        return this._tree.level;
    }

    private _basePhotosynthesisRate = 0.2;
    private _photosynthesisRateMultiplier = 1;
    private _baseGatherRate = 0.2;
    private _gatherRateMultiplier = 1;

    private attachedResources: ResourceTile[] = [];

    public resourceAmounts: ResourceAmounts = {
        sunlight: 0,
        sunlightCollectionRate: 0,
        water: 0,
        potassium: 0,
        glucose: 0,
        waterRate: 0,
        potassiumRate: 0,
        glucoseRate: 0
    }

    constructor(private _tree: ProceduralTree) {
        this.resourceAmounts = {
            sunlight: 0,
            sunlightCollectionRate: 2,
            water: 0,
            waterRate: 0,
            potassium: 0,
            potassiumRate: 0,
            glucose: 0,
            glucoseRate: 0
        }

        // start with some fake attached resources until we actually hook them up in the game
        this.attachedResources = [
            Water(-1, 128, -1), Water(-1, 128, -1), Water(-1, 128, -1),
            Potassium(-1, 128, -1), Potassium(-1, 128, -1)
        ];
    }

    public levelUp() {
        // TODO: eat resources here
        this._tree.levelUp();
    }

    public updateAttachedResources(dt: number) {
        dt = dt/1000;

        let oldWater = this.resourceAmounts.water;
        let oldPotassium = this.resourceAmounts.potassium;
        let oldGlucose = this.resourceAmounts.glucose;

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

        this.resourceAmounts.sunlight += this.resourceAmounts.sunlightCollectionRate * dt;

        let photosynthesisAmt = this._basePhotosynthesisRate * this._photosynthesisRateMultiplier * dt;
        photosynthesisAmt = Math.min(this.resourceAmounts.sunlight, photosynthesisAmt);

        // convert sunlight into glucose via photosynthesis
        this.resourceAmounts.glucose += photosynthesisAmt;
        this.resourceAmounts.sunlight -= photosynthesisAmt;


        this.resourceAmounts.waterRate = (this.resourceAmounts.water - oldWater)/dt;
        this.resourceAmounts.glucoseRate = (this.resourceAmounts.glucose - oldGlucose)/dt;
        this.resourceAmounts.potassiumRate = (this.resourceAmounts.potassium - oldPotassium)/dt;
    }

    public attachTo(tile: ResourceTile) {

        for (let i=0; i< this.attachedResources.length; i++)
        {
            if (this.attachedResources[i].id == tile.id)
            {
                return;
            }
        }

        this.attachedResources.push(tile);
    }
}