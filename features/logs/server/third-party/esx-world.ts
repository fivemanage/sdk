import { config } from "~/utils/common/config";
import { ingest } from "../logger";

if (config.logs.esxWorldEvents?.enabled) {
    const dataset = config.logs.esxWorldEvents.dataset;

    // esx_garage
    onNet("esx_garage:takeOutVehicle", (playerId: number, plate: string, model: string) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} took out vehicle ${model} (${plate}) from garage`, {
            playerSource,
            playerName,
            vehiclePlate: plate,
            vehicleModel: model,
            action: "takeOut",
        }, { _internal_RESOURCE: "esx_garage" });
    });

    onNet("esx_garage:storeVehicle", (playerId: number, plate: string, model: string) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} stored vehicle ${model} (${plate}) in garage`, {
            playerSource,
            playerName,
            vehiclePlate: plate,
            vehicleModel: model,
            action: "store",
        }, { _internal_RESOURCE: "esx_garage" });
    });

    // esx_property
    onNet("esx_property:buy", (playerId: number, propertyName: string, price: number) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} bought property ${propertyName} for $${price}`, {
            playerSource,
            playerName,
            propertyName,
            price,
        }, { _internal_RESOURCE: "esx_property" });
    });

    onNet("esx_property:enter", (playerId: number, propertyName: string) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} entered property ${propertyName}`, {
            playerSource,
            playerName,
            propertyName,
            action: "enter",
        }, { _internal_RESOURCE: "esx_property" });
    });

    onNet("esx_property:exit", (playerId: number, propertyName: string) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} exited property ${propertyName}`, {
            playerSource,
            playerName,
            propertyName,
            action: "exit",
        }, { _internal_RESOURCE: "esx_property" });
    });

    // esx_drugs
    onNet("esx_drugs:harvestPlants", (playerId: number, plantType: string, amount: number) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} harvested ${amount}x ${plantType}`, {
            playerSource,
            playerName,
            plantType,
            amount,
            action: "harvest",
        }, { _internal_RESOURCE: "esx_drugs" });
    });

    onNet("esx_drugs:processDrugs", (playerId: number, drugType: string, amount: number) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} processed ${amount}x ${drugType}`, {
            playerSource,
            playerName,
            drugType,
            amount,
            action: "process",
        }, { _internal_RESOURCE: "esx_drugs" });
    });

    // esx_license
    onNet("esx_license:addLicense", (playerId: number, licenseType: string) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} granted license ${licenseType}`, {
            playerSource,
            playerName,
            licenseType,
            action: "add",
        }, { _internal_RESOURCE: "esx_license" });
    });

    onNet("esx_license:removeLicense", (playerId: number, licenseType: string) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} had license ${licenseType} revoked`, {
            playerSource,
            playerName,
            licenseType,
            action: "remove",
        }, { _internal_RESOURCE: "esx_license" });
    });

    // esx_identity
    onNet("esx_identity:registrationDone", (playerId: number, firstName: string, lastName: string, dateOfBirth: string, sex: string, height: number) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} completed character registration`, {
            playerSource,
            playerName,
            firstName,
            lastName,
            dateOfBirth,
            sex,
            height,
        }, { _internal_RESOURCE: "esx_identity" });
    });

    // esx_ambulancejob
    onNet("esx_ambulancejob:revive", (targetId: number, medicId: number) => {
        const targetName = GetPlayerName(targetId.toString());
        const medicName = GetPlayerName(medicId.toString());
        ingest(dataset, "info", `player ${targetName} revived by ${medicName}`, {
            targetSource: targetId,
            targetName,
            playerSource: medicId,
            playerName: medicName,
        }, { _internal_RESOURCE: "esx_ambulancejob" });
    });

    onNet("esx_ambulancejob:onPlayerDead", (playerId: number) => {
        const playerName = GetPlayerName(playerId.toString());
        const playerSource = playerId;
        ingest(dataset, "info", `player ${playerName} declared dead`, {
            playerSource,
            playerName,
        }, { _internal_RESOURCE: "esx_ambulancejob" });
    });
}
