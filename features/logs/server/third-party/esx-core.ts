import { config } from "~/utils/common/config";
import { ingest } from "../logger";

if (config.logs.esxCoreEvents?.enabled) {
	const dataset = config.logs.esxCoreEvents.dataset;

	// Player lifecycle

	onNet(
		"esx:playerLoaded",
		(
			playerId: number,
			xPlayer: { job?: unknown; accounts?: unknown; identifier?: string },
		) => {
			const playerName = GetPlayerName(playerId.toString());
			ingest(
				dataset,
				"info",
				`player ${playerName} loaded`,
				{
					playerSource: playerId,
					playerName,
					job: xPlayer?.job,
					identifier: xPlayer?.identifier,
				},
				{ _internal_RESOURCE: "es_extended" },
			);
		},
	);

	onNet("esx:playerSpawned", (playerId: number) => {
		const playerName = GetPlayerName(playerId.toString());
		ingest(
			dataset,
			"info",
			`player ${playerName} spawned`,
			{
				playerSource: playerId,
				playerName,
			},
			{ _internal_RESOURCE: "es_extended" },
		);
	});

	// Job changes

	onNet(
		"esx:setJob",
		(
			playerId: number,
			job: { name: string; label: string; grade: number; grade_label: string },
			lastJob: { name: string; label: string; grade: number },
		) => {
			const playerName = GetPlayerName(playerId.toString());
			ingest(
				dataset,
				"info",
				`player ${playerName} job changed to ${job.name}`,
				{
					playerSource: playerId,
					playerName,
					job: {
						name: job.name,
						label: job.label,
						grade: job.grade,
						gradeLabel: job.grade_label,
					},
					previousJob: {
						name: lastJob.name,
						label: lastJob.label,
						grade: lastJob.grade,
					},
				},
				{ _internal_RESOURCE: "es_extended" },
			);
		},
	);

	// Inventory changes (built-in esx_inventory, NOT ox_inventory)

	onNet(
		"esx:addInventoryItem",
		(playerId: number, itemName: string, itemCount: number) => {
			const playerName = GetPlayerName(playerId.toString());
			ingest(
				dataset,
				"info",
				`player ${playerName} received item ${itemName} x${itemCount}`,
				{
					playerSource: playerId,
					playerName,
					itemName,
					itemCount,
					action: "add",
				},
				{ _internal_RESOURCE: "es_extended" },
			);
		},
	);

	onNet(
		"esx:removeInventoryItem",
		(playerId: number, itemName: string, itemCount: number) => {
			const playerName = GetPlayerName(playerId.toString());
			ingest(
				dataset,
				"info",
				`player ${playerName} lost item ${itemName} x${itemCount}`,
				{
					playerSource: playerId,
					playerName,
					itemName,
					itemCount,
					action: "remove",
				},
				{ _internal_RESOURCE: "es_extended" },
			);
		},
	);

	// Account money changes

	onNet(
		"esx:addAccountMoney",
		(playerId: number, accountName: string, money: number) => {
			const playerName = GetPlayerName(playerId.toString());
			ingest(
				dataset,
				"info",
				`player ${playerName} received $${money} in account ${accountName}`,
				{
					playerSource: playerId,
					playerName,
					accountName,
					amount: money,
					action: "add",
				},
				{ _internal_RESOURCE: "es_extended" },
			);
		},
	);

	onNet(
		"esx:removeAccountMoney",
		(playerId: number, accountName: string, money: number) => {
			const playerName = GetPlayerName(playerId.toString());
			ingest(
				dataset,
				"info",
				`player ${playerName} lost $${money} from account ${accountName}`,
				{
					playerSource: playerId,
					playerName,
					accountName,
					amount: money,
					action: "remove",
				},
				{ _internal_RESOURCE: "es_extended" },
			);
		},
	);

	onNet(
		"esx:setAccountMoney",
		(playerId: number, accountName: string, money: number) => {
			const playerName = GetPlayerName(playerId.toString());
			ingest(
				dataset,
				"info",
				`player ${playerName} account ${accountName} set to $${money}`,
				{
					playerSource: playerId,
					playerName,
					accountName,
					amount: money,
					action: "set",
				},
				{ _internal_RESOURCE: "es_extended" },
			);
		},
	);
}
