import { config } from "~/utils/common/config";
import { ingest } from "../logger";

if (config.logs.qbxPoliceEvents.enabled) {
	const dataset = config.logs.qbxPoliceEvents.dataset;

	onNet("police:server:SetHandcuffStatus", (isHandcuffed: boolean) => {
		const playerSource = global.source;

		ingest(dataset, "info", isHandcuffed ? "qbx_police.player.handcuffed" : "qbx_police.player.unhandcuffed", {
			playerSource,
			playerName: GetPlayerName(playerSource.toString()),
			isHandcuffed,
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:JailPlayer", (targetSrc: number, time: number) => {
		const playerSource = global.source;

		ingest(dataset, "info", "qbx_police.player.jailed", {
			playerSource,
			playerName: GetPlayerName(playerSource.toString()),
			targetSource: targetSrc,
			targetName: GetPlayerName(targetSrc.toString()),
			jailTimeMinutes: time,
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:BillPlayer", (targetSrc: number, price: number) => {
		const playerSource = global.source;

		ingest(dataset, "info", "qbx_police.player.billed", {
			playerSource,
			playerName: GetPlayerName(playerSource.toString()),
			targetSource: targetSrc,
			targetName: GetPlayerName(targetSrc.toString()),
			amount: price,
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:SeizeCash", (targetSrc: number) => {
		const playerSource = global.source;

		ingest(dataset, "info", "qbx_police.player.cashSeized", {
			playerSource,
			playerName: GetPlayerName(playerSource.toString()),
			targetSource: targetSrc,
			targetName: GetPlayerName(targetSrc.toString()),
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:Impound", (plate: string, fullImpound: boolean, price: number, body: number, engine: number, fuel: number) => {
		const playerSource = global.source;

		ingest(dataset, "info", fullImpound ? "qbx_police.vehicle.impounded" : "qbx_police.vehicle.sentToDepot", {
			playerSource,
			playerName: GetPlayerName(playerSource.toString()),
			plate,
			fullImpound,
			price: price ?? 0,
			bodyDamage: body,
			engineDamage: engine,
			fuelLevel: fuel,
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:Radar", (fine: number) => {
		const playerSource = global.source;

		ingest(dataset, "info", "qbx_police.player.radarFined", {
			playerSource,
			playerName: GetPlayerName(playerSource.toString()),
			fineIndex: fine,
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:policeAlert", (text: string, camId: number | undefined, playerSource: number | undefined) => {
		const source = global.source;

		ingest(dataset, "info", "qbx_police.alert.dispatched", {
			playerSource: playerSource ?? source,
			text,
			camId: camId ?? null,
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:FlaggedPlateTriggered", (radar: string, plate: string, street: string) => {
		const source = global.source;

		ingest(dataset, "info", "qbx_police.vehicle.flaggedPlateDetected", {
			playerSource: source,
			playerName: GetPlayerName(source.toString()),
			plate,
			street,
			radar,
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});

	onNet("police:server:SetTracker", (targetId: number) => {
		const playerSource = global.source;

		ingest(dataset, "info", "qbx_police.player.trackerUpdated", {
			playerSource,
			playerName: GetPlayerName(playerSource.toString()),
			targetSource: targetId,
			targetName: GetPlayerName(targetId.toString()),
		}, {
			_internal_RESOURCE: "qbx_police",
		});
	});
}
