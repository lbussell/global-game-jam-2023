export interface RootType {
    rootType: number,
    sunCost: number,
    waterCost: number,
    potassiumCost: number,
    glucoseCost: number
}

export const NormalRoot = (): RootType => {
    return {
        rootType: 0,
        sunCost: 0,
        waterCost: 10,
        potassiumCost: 10,
        glucoseCost: 0 
    }
}

export const GlassRoot = (): RootType => {
    return {
        rootType: 0,
        sunCost: 30,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 0 
    }
}
