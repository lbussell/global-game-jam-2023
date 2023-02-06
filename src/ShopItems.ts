import GameManager from "./GameManager";
import { GlassRoot, NormalRoot, RootType } from "./RootTypes";

export interface ShopItem {
    itemId: number,             // Id
    itemName: string,           // Item name in the shop
    itemGroup: string,          // Group name, other items in this group will be deactivated when this is activated
    sunCost: number,            // Sun cost to purchase
    waterCost: number,          // Water cost to purchase
    potassiumCost: number,      // Potassium cost to purchase
    glucoseCost: number,        // Glucose cost to purchase
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
        sunCost: 0,
        waterCost: 0,
        potassiumCost: 0,
        glucoseCost: 0,
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
        sunCost: 0,
        waterCost: 10,
        potassiumCost: 10,
        glucoseCost: 0,
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
    const calcSunCost = () => gameManager.treeLevel * 1;
    const calcWaterCost = () => gameManager.treeLevel * 1;
    const calcPotassiumCost = () => gameManager.treeLevel * 1;
    const calcGlucoseCost = () => gameManager.treeLevel * 1

    let sunCost = calcSunCost();
    let waterCost = calcWaterCost();
    let potassiumCost = calcPotassiumCost();
    let glucoseCost = calcGlucoseCost();
    let isUnlocked = false;

    const onPurchase = () => {
        console.log(isUnlocked);
        gameManager.levelUp();
        sunCost = calcSunCost();
        waterCost = calcWaterCost();
        potassiumCost = calcPotassiumCost();
        glucoseCost = calcGlucoseCost();
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