import GameManager from "./GameManager";
import { GlassRoot, NormalRoot, StretchRoot } from "./RootTypes";

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
        sunCost() { return 0; },
        waterCost(){ return 10; },
        potassiumCost(){ return 10; },
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

export const UpgradeTree = (gameManager: GameManager): ShopItem => {
    const calcSunCost = () => gameManager.treeLevel * 10;
    const calcWaterCost = () => gameManager.treeLevel * 10;
    const calcPotassiumCost = () => gameManager.treeLevel * 10;
    const calcGlucoseCost = () => gameManager.treeLevel * 10;

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
        itemId: 2,
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
        itemId: 3,
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
        isHovered: false
    }
}
