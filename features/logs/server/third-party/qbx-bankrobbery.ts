import { config } from "~/utils/common/config";
import { ingest } from "../logger";

if (config.logs.qbxBankrobberyEvents.enabled) {
	const dataset = config.logs.qbxBankrobberyEvents.dataset;

	onNet("qbx_bankrobbery:server:setBankState", (bankId: string | number) => {
		const source = global.source;
		const playerSource = source;
		ingest(dataset, "info", "qbx_bankrobbery.robbery.started", {
			playerSource,
			playerName: GetPlayerName(source.toString()),
			bankId,
			bankType: typeof bankId === "number" ? "small" : bankId,
		}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});

	onNet("qbx_bankrobbery:server:callCops", (type: string, bank: string | number, coords: number[]) => {
		const source = global.source;
		const playerSource = source;
		ingest(dataset, "info", "qbx_bankrobbery.alarm.triggered", {
			playerSource,
			playerName: GetPlayerName(source.toString()),
			bankType: type,
			bankId: bank,
			coords,
		}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});

	onNet("qbx_bankrobbery:server:recieveItem", (type: string, bankId: string | number, lockerId: string | number) => {
		const source = global.source;
		const playerSource = source;
		ingest(dataset, "info", "qbx_bankrobbery.loot.received", {
			playerSource,
			playerName: GetPlayerName(source.toString()),
			bankType: type,
			bankId,
			lockerId,
		}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});

	onNet("qbx_bankrobbery:server:SetStationStatus", (key: string, isHit: boolean) => {
		const source = global.source;
		const playerSource = source;
		ingest(dataset, "info", isHit ? "qbx_bankrobbery.powerStation.hit" : "qbx_bankrobbery.powerStation.restored", {
			playerSource,
			playerName: GetPlayerName(source.toString()),
			stationKey: key,
			isHit,
		}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});

	onNet("qbx_bankrobbery:server:removeElectronicKit", () => {
		const source = global.source;
		const playerSource = source;
		ingest(dataset, "info", "qbx_bankrobbery.item.electronicKitUsed", {
			playerSource,
			playerName: GetPlayerName(source.toString()),
		}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});

	onNet("qbx_bankrobbery:server:removeBankCard", (number: number) => {
		const source = global.source;
		const playerSource = source;
		ingest(dataset, "info", "qbx_bankrobbery.item.bankCardUsed", {
			playerSource,
			playerName: GetPlayerName(source.toString()),
			cardNumber: number,
		}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});

	on("qbx_bankrobbery:server:setTimeout", () => {
		ingest(dataset, "info", "qbx_bankrobbery.robbery.bigBankTimeoutStarted", {}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});

	on("qbx_bankrobbery:server:SetSmallBankTimeout", (bankId: string | number) => {
		ingest(dataset, "info", "qbx_bankrobbery.robbery.smallBankTimeoutStarted", {
			bankId,
		}, {
			_internal_RESOURCE: "qbx_bankrobbery",
		});
	});
}
