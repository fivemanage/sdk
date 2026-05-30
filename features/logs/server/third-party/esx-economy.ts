import { config } from "~/utils/common/config";
import { ingest } from "../logger";

if (config.logs.esxEconomyEvents?.enabled) {
    const dataset = config.logs.esxEconomyEvents.dataset;

    // esx_banking
    onNet("esx_banking:depositMoney", (playerId: number, amount: number) => {
        const playerName = GetPlayerName(playerId.toString());
        ingest(dataset, "info", `player ${playerName} deposited $${amount}`, {
            playerSource: playerId,
            playerName,
            amount,
            action: "deposit",
        }, { _internal_RESOURCE: "esx_banking" });
    });

    onNet("esx_banking:withdrawMoney", (playerId: number, amount: number) => {
        const playerName = GetPlayerName(playerId.toString());
        ingest(dataset, "info", `player ${playerName} withdrew $${amount}`, {
            playerSource: playerId,
            playerName,
            amount,
            action: "withdraw",
        }, { _internal_RESOURCE: "esx_banking" });
    });

    onNet("esx_banking:transferMoney", (senderId: number, targetId: number, amount: number) => {
        const senderName = GetPlayerName(senderId.toString());
        const targetName = GetPlayerName(targetId.toString());
        ingest(dataset, "info", `player ${senderName} transferred $${amount} to ${targetName}`, {
            playerSource: senderId,
            playerName: senderName,
            targetSource: targetId,
            targetName,
            amount,
            action: "transfer",
        }, { _internal_RESOURCE: "esx_banking" });
    });

    // esx_billing
    onNet("esx_billing:addBill", (targetId: number, senderId: number, societyName: string, label: string, amount: number) => {
        const targetName = GetPlayerName(targetId.toString());
        const senderName = GetPlayerName(senderId.toString());
        ingest(dataset, "info", `player ${targetName} billed $${amount} for "${label}" by ${senderName}`, {
            targetSource: targetId,
            targetName,
            playerSource: senderId,
            playerName: senderName,
            societyName,
            billLabel: label,
            amount,
        }, { _internal_RESOURCE: "esx_billing" });
    });

    onNet("esx_billing:payBill", (playerId: number, billId: number, amount: number) => {
        const playerName = GetPlayerName(playerId.toString());
        ingest(dataset, "info", `player ${playerName} paid bill #${billId} for $${amount}`, {
            playerSource: playerId,
            playerName,
            billId,
            amount,
        }, { _internal_RESOURCE: "esx_billing" });
    });

    // esx_society
    onNet("esx_society:pay", (playerId: number, societyName: string, amount: number) => {
        const playerName = GetPlayerName(playerId.toString());
        ingest(dataset, "info", `player ${playerName} paid $${amount} from society ${societyName}`, {
            playerSource: playerId,
            playerName,
            societyName,
            amount,
            action: "pay",
        }, { _internal_RESOURCE: "esx_society" });
    });

    onNet("esx_society:addMoney", (societyName: string, amount: number) => {
        ingest(dataset, "info", `society ${societyName} received $${amount}`, {
            societyName,
            amount,
            action: "add",
        }, { _internal_RESOURCE: "esx_society" });
    });

    onNet("esx_society:removeMoney", (societyName: string, amount: number) => {
        ingest(dataset, "info", `society ${societyName} lost $${amount}`, {
            societyName,
            amount,
            action: "remove",
        }, { _internal_RESOURCE: "esx_society" });
    });

    // esx_vehicleshop
    onNet("esx_vehicleshop:buyVehicle", (playerId: number, model: string, price: number, type: string) => {
        const playerName = GetPlayerName(playerId.toString());
        ingest(dataset, "info", `player ${playerName} bought vehicle ${model} for $${price}`, {
            playerSource: playerId,
            playerName,
            vehicleModel: model,
            vehicleType: type,
            price,
        }, { _internal_RESOURCE: "esx_vehicleshop" });
    });

    // esx_weaponshop
    onNet("esx_weaponshop:buyWeapon", (playerId: number, weaponName: string, price: number) => {
        const playerName = GetPlayerName(playerId.toString());
        ingest(dataset, "info", `player ${playerName} bought weapon ${weaponName} for $${price}`, {
            playerSource: playerId,
            playerName,
            weaponName,
            price,
        }, { _internal_RESOURCE: "esx_weaponshop" });
    });

    onNet("esx_weaponshop:buyAmmo", (playerId: number, weaponName: string, ammoCount: number, price: number) => {
        const playerName = GetPlayerName(playerId.toString());
        ingest(dataset, "info", `player ${playerName} bought ${ammoCount}x ammo for ${weaponName}`, {
            playerSource: playerId,
            playerName,
            weaponName,
            ammoCount,
            price,
        }, { _internal_RESOURCE: "esx_weaponshop" });
    });
}
