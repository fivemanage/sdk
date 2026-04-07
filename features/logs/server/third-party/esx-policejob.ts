import { config } from "~/utils/common/config";
import { ingest } from "../logger";

if (config.logs.esxPoliceEvents?.enabled) {
    const dataset = config.logs.esxPoliceEvents.dataset;

    onNet("esx_policejob:jailPlayer", (targetId: number, time: number, officerId: number) => {
        const targetName = GetPlayerName(targetId.toString());
        const officerName = GetPlayerName(officerId.toString());
        ingest(dataset, "info", `player ${targetName} jailed for ${time} minutes by ${officerName}`, {
            targetSource: targetId,
            targetName,
            playerSource: officerId,
            playerName: officerName,
            jailTime: time,
        }, { _internal_RESOURCE: "esx_policejob" });
    });

    onNet("esx_policejob:handcuffed", (targetId: number, officerId: number) => {
        const targetName = GetPlayerName(targetId.toString());
        const officerName = GetPlayerName(officerId.toString());
        ingest(dataset, "info", `player ${targetName} handcuffed by officer ${officerName}`, {
            targetSource: targetId,
            targetName,
            playerSource: officerId,
            playerName: officerName,
        }, { _internal_RESOURCE: "esx_policejob" });
    });

    onNet("esx_policejob:seizeWeapons", (targetId: number, officerId: number, weapons: unknown[]) => {
        const targetName = GetPlayerName(targetId.toString());
        const officerName = GetPlayerName(officerId.toString());
        ingest(dataset, "info", `weapons seized from ${targetName} by officer ${officerName}`, {
            targetSource: targetId,
            targetName,
            playerSource: officerId,
            playerName: officerName,
            weapons,
        }, { _internal_RESOURCE: "esx_policejob" });
    });
}
