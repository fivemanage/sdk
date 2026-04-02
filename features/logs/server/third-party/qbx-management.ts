import { ingest } from "../logger";
import { config } from "~/utils/common/config";

if (config.logs.qbxManagementEvents.enabled) {
	const dataset = config.logs.qbxManagementEvents.dataset;

	onNet("QBCore:Server:OnPlayerLoaded", () => {
		const _source = global.source;

		ingest(dataset, "info", "qbx_management.player.loaded", {
			playerSource: _source,
			playerName: GetPlayerName(_source.toString()),
		}, {
			_internal_RESOURCE: "qbx_management",
		});
	});

	on("QBCore:Server:OnPlayerUnload", () => {
		const source = global.source;

		ingest(dataset, "info", "qbx_management.player.unloaded", {
			playerSource: source,
		}, {
			_internal_RESOURCE: "qbx_management",
		});
	});

	on("QBCore:Server:SetDuty", (source: number, duty: boolean) => {
		ingest(dataset, "info", duty ? "qbx_management.player.clockedIn" : "qbx_management.player.clockedOut", {
			playerSource: source,
			playerName: GetPlayerName(source.toString()),
			onDuty: duty,
		}, {
			_internal_RESOURCE: "qbx_management",
		});
	});

	on("QBCore:Server:OnJobUpdate", (source: number, job: unknown) => {
		ingest(dataset, "info", "qbx_management.player.jobUpdated", {
			playerSource: source,
			playerName: GetPlayerName(source.toString()),
			job,
		}, {
			_internal_RESOURCE: "qbx_management",
		});
	});

	on("qbx_core:server:onJobUpdate", (jobName: string, job: unknown) => {
		ingest(dataset, "info", "qbx_management.job.definitionUpdated", {
			jobName,
			job,
		}, {
			_internal_RESOURCE: "qbx_management",
		});
	});

	on("qbx_core:server:onGangUpdate", (gangName: string, gang: unknown) => {
		ingest(dataset, "info", "qbx_management.gang.definitionUpdated", {
			gangName,
			gang,
		}, {
			_internal_RESOURCE: "qbx_management",
		});
	});
}
