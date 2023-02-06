export interface RootType {
    rootType: number,
    sunCost: number,
    waterCost: number,
    potassiumCost: number,
    glucoseCost: number,
    rootColor: number,
    maxLength: number
}

export const NormalRoot = (): RootType => {
    return {
        rootType: 0,
        sunCost: 0,
        waterCost: 10,
        potassiumCost: 10,
        glucoseCost: 0,
        rootColor: -1,
        maxLength: 100
    }
}

export const GlassRoot = (): RootType => {
    return {
        rootType: 1,
        sunCost: 30,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 0,
        rootColor: 0x9999ff,
        maxLength: 100
    }
}

export const StretchRoot = (): RootType => {
    return {
        rootType: 2,
        sunCost: 0,
        waterCost: 15,
        potassiumCost: 15,
        glucoseCost: 0,
        rootColor: 0x999999,
        maxLength: 200
    }
}
