export interface RootType {
    rootType: RootTypes,
    sunCost: number,
    waterCost: number,
    potassiumCost: number,
    glucoseCost: number
}

export enum RootTypes
{
    Normal = 0,
    Glass = 1,
    Bulb = 2,
    Stretch = 3,
    Soil = 4,
    Efficient = 5
};

export const NormalRoot = (): RootType => {
    return {
        rootType: RootTypes.Normal,
        sunCost: 0,
        waterCost: 10,
        potassiumCost: 10,
        glucoseCost: 0 
    }
}

export const GlassRoot = (): RootType => {
    return {
        rootType: RootTypes.Glass,
        sunCost: 30,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 0 
    }
}

export const BulbRoot = (): RootType =>
{
    return {
        rootType: RootTypes.Bulb,
        sunCost: 20,
        waterCost: 20,
        potassiumCost: 0,
        glucoseCost: 0
    }
}

export const StretchRoot = (): RootType =>
{
    return {
        rootType: RootTypes.Stretch,
        sunCost: 0,
        waterCost: 15,
        potassiumCost: 15,
        glucoseCost: 0
    }
}

export const SoilRoot = (): RootType =>
{
    return {
        rootType: RootTypes.Soil,
        sunCost: 0,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 200
    }
}

export const EfficientRoot = (): RootType =>
{
    return {
        rootType: RootTypes.Efficient,
        sunCost: 0,
        waterCost: 0,
        potassiumCost: 20,
        glucoseCost: 0
    }
}
