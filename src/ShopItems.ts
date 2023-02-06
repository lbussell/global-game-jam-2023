import GameManager from "./GameManager";
import { BulbRoot, EfficientRoot, GlassRoot, NormalRoot, RootType, SoilRoot, StretchRoot } from "./RootTypes";

export interface ShopItem {
    itemId: number,             // Id
    itemName: string,           // Item name in the shop
    itemGroup: string,          // Group name, other items in this group will be deactivated when this is activated
    sunCost: () => number,            // Sun cost to purchase
    waterCost: () => number,          // Water cost to purchase
    potassiumCost: () => number,      // Potassium cost to purchase
    glucoseCost: () => number,        // Glucose cost to purchase
    onPurchase: () => void,     // Callback on purchase event
    onActivate: () => void,     // Callback on activation event
    onDeactivate: () => void,   // Callback on deactivation event
    isActive: boolean,          // Is the upgrade active
    isUnlocked: boolean,        // Is the upgrade unlocked (purchased)
    isProgressiveUpgrade: boolean,
    isHovered: boolean          // Is the upgrade hovered (internal)
}

export const ActivateNormalRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 0,
        itemName: "Normal Root",
        itemGroup: 'roottype',
        sunCost() { return 0; },
        waterCost(){ return 0; },
        potassiumCost(){ return 0; },
        glucoseCost(){ return 0; },
        onPurchase() {},
        onActivate() {
            gameManager.activeRootType = NormalRoot();
        },
        onDeactivate() {},
        isActive: false,
        isUnlocked: true,
        isProgressiveUpgrade: false,
        isHovered: false,
    }
}

export const UnlockGlassRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 1,
        itemName: "Glass Root",
        itemGroup: 'roottype',
        sunCost() { return 50; },
        waterCost(){ return 0; },
        potassiumCost(){ return 0; },
        glucoseCost(){ return 0; },
        onPurchase() {},
        onActivate() {
            gameManager.activeRootType = GlassRoot();
        },
        onDeactivate() {},
        isActive: false,
        isUnlocked: false,
        isProgressiveUpgrade: false,
        isHovered: false
    }
}

export const UnlockBulbRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 2,
        itemGroup: 'roottype',
        sunCost: 0,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 0,
        onPurchase() {},
        onActivate() {
            gameManager.activeRootType = BulbRoot();
        },
        onDeactivate() {},
        isActive: false,
        isUnlocked: false,
        isHovered: false
    }
}

export const UnlockSoilRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 4,
        itemGroup: 'roottype',
        sunCost: 0,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 0,
        onPurchase() {},
        onActivate() {
            gameManager.activeRootType = SoilRoot();
        },
        onDeactivate() {},
        isActive: false,
        isUnlocked: false,
        isHovered: false
    }
}

export const UnlockEfficientRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 5,
        itemGroup: 'roottype',
        sunCost: 0,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 0,
        onPurchase() {},
        onActivate() {
            gameManager.activeRootType = EfficientRoot();
        },
        onDeactivate() {},
        isActive: false,
        isUnlocked: false,
        isHovered: false
    }
}

export const UpgradeTree = (gameManager: GameManager): ShopItem => {
    const calcSunCost = () => gameManager.treeLevel * 5;
    const calcWaterCost = () => gameManager.treeLevel * 5;
    const calcPotassiumCost = () => gameManager.treeLevel * 5;
    const calcGlucoseCost = () => gameManager.treeLevel * 5;

    let sunCost = calcSunCost;
    let waterCost = calcWaterCost;
    let potassiumCost = calcPotassiumCost;
    let glucoseCost = calcGlucoseCost;
    let isUnlocked = false;

    const onPurchase = () => {
        console.log(isUnlocked);
        gameManager.levelUp();
        isUnlocked = false;
        console.log(isUnlocked);
    };

    return {
        itemId: 2,
        itemGroup: 'treeupgrade',
        itemName: "Upgrade Tree",
        sunCost: sunCost,
        waterCost: waterCost,
        potassiumCost: potassiumCost,
        glucoseCost: glucoseCost,
        onPurchase: onPurchase,
        onActivate() {
        },
        onDeactivate() {},
        isActive: false,
        isUnlocked: isUnlocked,
        isProgressiveUpgrade: true,
        isHovered: false
    }
}

export const UnlockStretchRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 3,
        itemName: "Stretch Root",
        itemGroup: 'roottype',
        sunCost() { return 10; },
        waterCost(){ return 0; },
        potassiumCost(){ return 0; },
        glucoseCost(){ return 10; },
        onPurchase() {},
        onActivate() {
            gameManager.activeRootType = StretchRoot();
        },
        onDeactivate() {},
        isActive: false,
        isUnlocked: false,
        isProgressiveUpgrade: false,
        isHovered: false
    }
}

export const UpgradeRoots = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 4,
        level: 1,
        itemName: "Gather Faster",
        itemGroup: 'upgrade',
        sunCost() { return 0; },
        waterCost(){ return 0; },
        potassiumCost(){ return 0; },
        glucoseCost(){ return 15*this.level; },
        onPurchase() {
            this.level += 1;
            gameManager.setGatherRateMultiplier(this.level);
        },
        onActivate() {},
        onDeactivate() {},
        isActive: false,
        isUnlocked: false,
        isProgressiveUpgrade: true,
        isHovered: false
    }
}

// export const GenerateGlucose = (gameManager: GameManager): ShopItem => {
//     return {
//         itemId: 5,
//         level: 1,
//         itemName: "Generate Glucose",
//         itemGroup: 'boost',
//         sunCost() { let max = Math.min(gameManager.resourceAmounts.glucose, gameManager.resourceAmounts.sunlight);
//                     let i = 1;
//                     while(Math.pow(10, i) <= max)
//                     {
//                         ++i;
//                     }
//                     console.log(Math.pow(10, i-1));
//                     return Math.pow(10, i-1); },
//         waterCost(){ return 0; },
//         potassiumCost(){ return this.sunCost(); },
//         glucoseCost(){ return 0; },
//         onPurchase() {
//             gameManager.resourceAmounts.glucose += this.sunCost();
//         },
//         onActivate() {},
//         onDeactivate() {},
//         isActive: false,
//         isUnlocked: false,
//         isHovered: false
//     }
// }
