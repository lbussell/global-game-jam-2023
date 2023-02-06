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
        isHovered: false
    }
}

// export const GrowTree = (gameManager: GameManager): ShopItem => {
//     return {
//         itemId: 3,
//         itemName: "Grow the Tree",
//         itemGroup: 'roottype',
//         sunCost() { return 0; },
//         waterCost(){ return 10; },
//         potassiumCost(){ return 10; },
//         glucoseCost(){ return 0; },
//         onPurchase() {},
//         onActivate() {
//             gameManager.activeRootType = StretchRoot();
//         },
//         onDeactivate() {},
//         isActive: false,
//         isUnlocked: false,
//         isHovered: false
//     }
// }
