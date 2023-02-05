import Phaser from "phaser";
import Perlin from './perlin';
import {
    ResourceTile, 
    TilemapObject, 
    ResourceTileType,
    Water,
    Potassium,
    WaterConfigurations,
    PotassiumConfigurations
} from './Resources';

const perlinMin = -Math.sqrt(2) / 2;
const perlinMax = -perlinMin;

export class ResourceGenerationData
{
    constructor(
        public _rarity : number, 
        public _spawnIncreaseRate : number,
        public _resourceAmountMin : number, 
        public _resourceAmountMax : number)
    {
    }
}

export default class MapGenerator
{
    private _noiseGenerator : Perlin; 
    private _grid : (TilemapObject | null)[][];

    constructor(
        private _scene : Phaser.Scene,
        private _mapDimensions : Phaser.Math.Vector2,
        private _generationData : Map<ResourceTileType, ResourceGenerationData>,
        private _seed : number,
        private _chunkSize : number
    ) {
        this._noiseGenerator = new Perlin(this._seed);
        this._grid = Array.from(Array(_mapDimensions.y), () => new Array(_mapDimensions.x).fill(null));
    }

    private IsOutOfBounds(position : Phaser.Math.Vector2)
    {
        if (position.x < 0 || position.x >= this._mapDimensions.x ||
            position.y < 0 || position.y >= this._mapDimensions.y)
        {
            console.log(position.x, position.y);
            return true;
        }

        return false;
    }

    private DrawResourceConfiguration(configuration : number[][], gridPosition : Phaser.Math.Vector2, resource : ResourceTileType, resourceAmount : number) 
    {
        let count = 0;

        for (let r = 0; r < configuration.length; ++r)
        {
            for (let c = 0; c < configuration[r].length; ++c)
            {
                if (!this.IsOutOfBounds(new Phaser.Math.Vector2(gridPosition.x + c, gridPosition.y + r)))
                {
                    let resourceTile : ResourceTile | null = null;

                    switch (resource)
                    {
                        case ResourceTileType.Water:
                        {
                            resourceTile = Water(resourceAmount, configuration[r][c]);
                            count += 1;
                            break;
                        }
                        case ResourceTileType.Potassium:
                            resourceTile = Potassium(resourceAmount, configuration[r][c]);
                            break;
                    }

                    this._grid[gridPosition.y + r][gridPosition.x + c] = resourceTile;
                }
            }
        }

        console.log(count);
    }

    private DoResourcesOverlap(configuration : number[][], gridPosition : Phaser.Math.Vector2)
    {
        // Loop through the configuration 
        for (let r = 0; r < configuration.length; ++r)
        {
            for (let c = 0; c < configuration[r].length; ++c)
            {
                // Make sure this tile is in map bounds
                if (!this.IsOutOfBounds(new Phaser.Math.Vector2(gridPosition.x + c, gridPosition.y + r)))
                {
                    // If this tile has a valid tile index and there is already a tile placed here (besides dirt), return true
                    if (configuration[r][c] >= 0 && this._grid[gridPosition.y + r][gridPosition.x + c] != null)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public GenerateMap()
    {
        this._generationData.forEach((ResourceGenData, Resource) =>
        {
            this._seed = Math.random() * Number.MAX_SAFE_INTEGER;
            this._noiseGenerator = new Perlin(this._seed);

            var densityMaps : Map<Phaser.Math.Vector2, number> = new Map<Phaser.Math.Vector2, number>();

            for (let chunkRow = 1; chunkRow < Math.floor(this._mapDimensions.y / this._chunkSize); ++chunkRow)
            {
                for (let chunkColumn = 0; chunkColumn < Math.floor(this._mapDimensions.x / this._chunkSize); ++chunkColumn)
                {
                    var chunkPos = new Phaser.Math.Vector2(chunkColumn * this._chunkSize, chunkRow * this._chunkSize);
                    var chunkRarity = ResourceGenData._rarity + (chunkRow * ResourceGenData._spawnIncreaseRate);
                    densityMaps.set(chunkPos, chunkRarity);
                }
            }

            densityMaps.forEach((rarity, chunkPosition) =>
            {
                var perlinValue = this._noiseGenerator.simplex2(chunkPosition.x / 4, (chunkPosition.y / 4) * 0.25);

                if (perlinValue <= rarity && perlinValue > -rarity)
                {
                    var xPos : number | null = null;
                    var yPos : number | null = null;
                    var numTilesTried = 0;

                    while (xPos == null && yPos == null && numTilesTried < this._chunkSize * this._chunkSize)
                    {
                        // Pick random tile inside chunk
                        xPos = Math.floor(Math.random() * this._chunkSize) + chunkPosition.x;
                        yPos = Math.floor(Math.random() * this._chunkSize) + chunkPosition.y;
                        let gridPosition =  new Phaser.Math.Vector2(xPos, yPos);
                        let configuration : number[][];

                        switch (Resource)
                        {
                            case (ResourceTileType.Potassium):
                            {
                                configuration = PotassiumConfigurations[0];
                                break;
                            }
                            case (ResourceTileType.Water):
                            {
                                configuration = WaterConfigurations[0];
                                break;
                            }
                        }

                        // If there is no overlap with this resource pattern and another resource
                        if (!this.DoResourcesOverlap(configuration, gridPosition))
                        {
                            var resourceAmount = Math.floor(Math.random() * (ResourceGenData._resourceAmountMax - ResourceGenData._resourceAmountMin) + ResourceGenData._resourceAmountMin);

                            this.DrawResourceConfiguration(configuration, gridPosition, Resource, resourceAmount);
                        }
                        else
                        {
                            xPos = null;
                            yPos = null;
                        }

                        ++numTilesTried;
                    }
                }
            })
        })

        return this._grid;
    }
}