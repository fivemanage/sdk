import { config } from "~/utils/common/config";
import { ingest } from "../logger";
import { getFormattedPlayerIdentifiers } from "~/utils/server/identifiers";

interface InventorySlot {
    name: string;
    label: string;
    metadata: unknown[];
    weight: number;
    close: boolean;
    slot: number;
    stack: boolean;
    count: number;
}

interface SwapItemsData {
    toSlot: InventorySlot;
    fromSlot: InventorySlot;
    toInventory: number;
    fromInventory: number;
    source: number;
    count: number;
    toType: string;
    fromType: string;
    action: string;
}

interface ShopSlot {
    price: number;
    slot: number;
    name: string;
    weight: number;
}

interface BuyItemData {
    count: number;
    shopType: string;
    fromSlot: ShopSlot;
    price: number;
    source: number;
    currency: string;
    shopId: number;
    toInventory: number;
    metadata: unknown[];
    toSlot: number;
    itemName: string;
    totalPrice: number;
}

if (config.logs.oxInventoryEvents.enabled) {
    const exp = global.exports;
    const dataset = config.logs.oxInventoryEvents.dataset;

    exp.ox_inventory.registerHook('buyItem', (_data) => {
        const data = _data as unknown as BuyItemData;
        const toInventory = Number.isInteger(data.toInventory) ? getFormattedPlayerIdentifiers(data.toInventory) : data.toInventory;

        // probably the most important attributes to log
        ingest(dataset, 'info', 'ox_inventory.buyItem', {
            fromSlot: {
                price: data.fromSlot.price,
                name: data.fromSlot.name,
            },
            toInventory,
            price: data.price,
            currency: data.currency,
            shopType: data.shopType,
            shopId: data.shopId,
            count: data.count,
            itemName: data.itemName,
            totalPrice: data.totalPrice,
            metadata: data.metadata,
            resource: "ox_inventory"
        })
    })

    exp.ox_inventory.registerHook('swapItems', (_data) => {
        const data = _data as unknown as SwapItemsData;

        const fromInventory = Number.isInteger(data.fromInventory) ? getFormattedPlayerIdentifiers(data.source) : data.fromInventory
        const toInventory = Number.isInteger(data.toInventory) ? getFormattedPlayerIdentifiers(data.toInventory) : data.toInventory;

        const toPlayerName = Number.isInteger(data.toInventory) ? GetPlayerName(data.toInventory.toString()) : null
        const fromPlayerName = Number.isInteger(data.fromInventory) ? GetPlayerName(data.fromInventory.toString()) : null;

        // also probably the most important attributes to log
        ingest(dataset, 'info', 'ox_inventory.swapItems', {
            toSlot: {
                name: data.toSlot.name,
                label: data.toSlot.label,
                count: data.toSlot.count,
                metadata: data.toSlot.metadata,
            },
            fromSlot: {
                name: data.fromSlot.name,
                label: data.fromSlot.label,
                count: data.fromSlot.count,
                metadata: data.fromSlot.metadata,
            },
            action: data.action,
            fromInventory: fromInventory,
            fromPlayerName: fromPlayerName,
            toInventory: toInventory,
            toPlayerName: toPlayerName,
            fromType: data.fromType,
            resource: "ox_inventory"
        })
    })

    // maybe valuable to log?
    /* exp.ox_inventory.registerHook('ox_inventory.openInventory', (_data) => {
          const data = _data as unknown as SwapItemsData;
    }) */

    // this is never called in ox_inventory at all
    /* exp.ox_inventory.registerHook('openShop', (_data) => {
        console.log("opening a shop")
        const data = _data as unknown as SwapItemsData;
    }) */
}