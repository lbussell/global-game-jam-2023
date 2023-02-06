import GameManager from "./GameManager";
import { GlassRoot, NormalRoot, RootType } from "./RootTypes";

export interface ShopItem {
    itemId: number,             // Id
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
    isHovered: boolean          // Is the upgrade hovered (internal)
}

export const ActivateNormalRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 0,
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
        isHovered: false,
    }
}

export const UnlockGlassRoot = (gameManager: GameManager): ShopItem => {
    return {
        itemId: 1,
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
        isHovered: false
    }
}
