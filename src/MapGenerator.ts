import Phaser from "phaser";
import Perlin from './perlin';
import {Resource, TilemapObject} from './Resources';

export class ResourceGenerationData
{
    public _rarity : number;
    public _resourceAmountMin : number;
    public _resourceAmountMax : number;

    constructor(rarity : number, resourceAmountMin : number, resourceAmountMax : number)
    {
        this._rarity = rarity;
        this._resourceAmountMin = resourceAmountMin;
        this._resourceAmountMax = resourceAmountMax;
    }
}

export default class MapGenerator
{
    private _noiseGenerator : Perlin; 
    private _grid : (TilemapObject | null)[][];

    constructor(
        private _scene : Phaser.Scene,
        private _mapDimensions : Phaser.Math.Vector2,
        private _generationData : Map<Resource, ResourceGenerationData>,
        private _seed : number
    ) {
        this._noiseGenerator = new Perlin(this._seed);
        this._grid = [];
        console.log(this._seed);
    }

    public GenerateMap()
    {
        var densityMaps = null;

        this._generationData.forEach((value, key) =>
        {
            var densityMap = Array.from(Array(this._mapDimensions.y), () => Array.from({length: this._mapDimensions.x}, () => Math.random() * value._rarity))
            
        
        })

        for (let r = 0; r < this._mapDimensions.y; ++r)
        {
            this._grid[r] = [];
            for (let c = 0; c < this._mapDimensions.x; ++c)
            {
                var perlinValue = this._noiseGenerator.perlin2(r * Math.random() / 100, c * Math.random() / 100);
                var currentPerlinMin = 0;
                let result : Resource | null = null;
                console.log(perlinValue);

                this._generationData.forEach((value, key) =>
                {
                    var perlinMax = currentPerlinMin + value._rarity;
                    
                    if (perlinValue >= currentPerlinMin && perlinValue < perlinMax)
                    {
                        result = key;
                    }
                    currentPerlinMin = perlinMax;
                })

                this._grid[r][c] = result;
            }
        }

        return this._grid;
    }
}