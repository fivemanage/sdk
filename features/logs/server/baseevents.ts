// WIP

import { config } from "~/utils/common/config";
import { ingest } from "./logger";

interface DeathData {
    killervehseat: number;
    weaponhash: number;
    killervehname: string;
    killertype: number;
    killerpos: number[]
    killerinveh: boolean;
}

interface FormattedDeathData {
    killerVehicleSeat: number;
    weaponHash: number;
    killerVehicleName: string;
    killerType: number;
    killerPosition: number[]
    killerInVehicle: boolean;
}

enum PedType {
    Michael = 0,
    Franklin = 1,
    Trevor = 2,
    Army = 29,
    Animal = 28,
    Swat = 27,
    LSFD = 21,
    Paramedic = 20,
    Cop = 6,
    Male = 4,
    Female = 5,
    Human = 26
}

if (config.logs.baseEvents.enabled) {
    const dataset = config.logs.baseEvents.dataset;

    onNet("baseevents:onPlayerDied", (killerType: number, deathCoords: string[]) => {
        const _source = global.source
        const playerName = GetPlayerName(_source.toString())

        ingest(dataset, 'info', `player ${playerName} died`, {
            playerSource: _source,
            playerName,
            killerType,
            deathCoords
        })
    })

    onNet("baseevents:onPlayerKilled", (killerId: number, deathData: DeathData) => {
        const _source = global.source
        const playerName = GetPlayerName(_source.toString())
        const killerName = GetPlayerName(killerId.toString())

        const formattedData: FormattedDeathData = {
            killerVehicleSeat: deathData.killervehseat,
            weaponHash: deathData.weaponhash,
            killerVehicleName: deathData.killervehname,
            killerType: deathData.killertype,
            killerPosition: deathData.killerpos,
            killerInVehicle: deathData.killerinveh
        }

        ingest(dataset, 'info', `player ${playerName} killed`, {
            playerSource: _source,
            playerName,
            killer: {
                id: killerId,
                playerName: killerName ?? PedType[formattedData.killerType],
            },
            deathData: formattedData,
        })
    })
}