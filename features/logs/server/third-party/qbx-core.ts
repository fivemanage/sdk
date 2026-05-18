import { config } from "~/utils/common/config";
import { ingest } from "../logger";

if (config.logs.qbxCoreEvents.enabled) {
    const dataset = config.logs.qbxCoreEvents.dataset;

    onNet("QBCore:Server:OnPlayerLoaded", () => {
        const playerSource = global.source
        const playerName = GetPlayerName(playerSource.toString())

        ingest(dataset, 'info', 'qbx_core.player.loaded', {
            playerSource,
            playerName,
        }, {
            _internal_RESOURCE: "qbx_core"
        })
    })

    on("QBCore:Server:OnPlayerUnload", (playerSource: number) => {
        const playerName = GetPlayerName(playerSource.toString())

        ingest(dataset, 'info', 'qbx_core.player.unloaded', {
            playerSource,
            playerName,
        }, {
            _internal_RESOURCE: "qbx_core"
        })
    })

    onNet("QBCore:ToggleDuty", () => {
        const playerSource = global.source
        const playerName = GetPlayerName(playerSource.toString())

        ingest(dataset, 'info', 'qbx_core.player.dutyToggled', {
            playerSource,
            playerName,
        }, {
            _internal_RESOURCE: "qbx_core"
        })
    })

    on("QBCore:Server:OnJobUpdate", (playerSource: number, job: unknown) => {
        const playerName = GetPlayerName(playerSource.toString())

        ingest(dataset, 'info', 'qbx_core.player.jobUpdated', {
            playerSource,
            playerName,
            job,
        }, {
            _internal_RESOURCE: "qbx_core"
        })
    })

    on("qbx_core:server:onJobUpdate", (jobName: string, job: unknown) => {
        ingest(dataset, 'info', 'qbx_core.job.updated', {
            jobName,
            job,
        }, {
            _internal_RESOURCE: "qbx_core"
        })
    })

    on("qbx_core:server:onGangUpdate", (gangName: string, gang: unknown) => {
        ingest(dataset, 'info', 'qbx_core.gang.updated', {
            gangName,
            gang,
        }, {
            _internal_RESOURCE: "qbx_core"
        })
    })
}
