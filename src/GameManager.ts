import Phaser from 'phaser';
import ProceduralTree from './ProceduralTree';
import { ResourceTile, ResourceTileType, Water, Potassium } from './Resources';
import { NormalRoot, GlassRoot, RootType, RootTypes } from './RootTypes';

export interface ResourceAmounts {
    sunlight: number,
    sunlightCollectionRate: number,
    water: number,
    waterRate: number,
    potassium: number,
    potassiumRate: number,
    bonusPotassiumRate : number
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

    public resourceAmounts: ResourceAmounts;
    public activeRootType: RootType = NormalRoot();

    constructor(private _tree: ProceduralTree) {
        this.resourceAmounts = {
            sunlight: 0,
            sunlightCollectionRate: 2,
            water: 0,
            waterRate: 0,
            potassium: 2000,
            potassiumRate: 0,
            bonusPotassiumRate: 0,
            glucose: 20000,
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

        this.resourceAmounts.potassium += this.resourceAmounts.bonusPotassiumRate * dt;

        // convert sunlight into glucose via photosynthesis
        this.resourceAmounts.glucose += photosynthesisAmt;
        this.resourceAmounts.sunlight -= photosynthesisAmt;


        this.resourceAmounts.waterRate = (this.resourceAmounts.water - oldWater)/dt;
        this.resourceAmounts.glucoseRate = (this.resourceAmounts.glucose - oldGlucose)/dt;
        this.resourceAmounts.potassiumRate = (this.resourceAmounts.potassium - oldPotassium)/dt;
    }

    // return true if the attach was successful
    public attachTo(tile: ResourceTile, rootType : RootType): boolean {

        if (rootType.rootType == RootTypes.Glass)
        {
            return false;
        }

        for (let i=0; i< this.attachedResources.length; i++)
        {
            if (this.attachedResources[i].id == tile.id)
            {
                return false;
            }
        }

        if (rootType.rootType == RootTypes.Efficient)
        {
            tile.ratePerSec /= 2;
            tile.resourceQuantity *= 2;
        }

        this.attachedResources.push(tile);
        return true;
    }
}