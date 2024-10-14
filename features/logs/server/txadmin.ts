import { config } from "~/utils/common/config";
import { log } from "./logger";
import { FormattedPlayerIdentifiers, IdentifierType } from "~/utils/server/identifiers";

if (config.logs.txAdminEvents) {
	on("txAdmin:events:playerKicked", (eventData: { target: number; author: string; reason: string }) => {
		const playerName = GetPlayerName(eventData.target);

		log("info", `txAdmin: Player ${playerName} was kicked`, {
			playerSource: eventData.target,
			playerName: playerName,
			author: eventData.author,
			reason: eventData.reason,
		});
	});

	on("txAdmin:events:playerWarned", (eventData: { author: string; reason: string; actionId: string; targetNetId: number; targetIds: string[]; targetName: string }) => {
		log("info", `txAdmin: Player ${eventData.targetName} was warned`, eventData);
	});

	on(
		"txAdmin:events:playerBanned",
		(eventData: {
			author: string;
			reason: string;
			actionId: string;
			expiration: number;
			durationInput: number;
			durationTranslated: number;
			targetNetId: number;
			targetIds: string[];
			targetHwids: string[];
			targetName: string;
			kickMessage: string;
		}) => {
			log("info", `txAdmin: Player ${eventData.targetName} was banned`, eventData);
		}
	);

	on("txAdmin:events:healedPlayer", (eventData: { id: number }) => {
		const target = eventData.id === -1 ? "Everyone" : `Player ${GetPlayerName(eventData.id)}`;

		log("info", `txAdmin: ${target} was healed`, eventData);
	});

	on("txAdmin:events:announcement", (eventData: { author: string; message: string }) => {
		log("info", `txAdmin: Broadcast from ${eventData.author}`, eventData);
	});

	on("txAdmin:events:serverShuttingDown", (eventData: { delay: number; author: string; message: string }) => {
		log("info", "txAdmin: Server shutting down", eventData);
	});

	on("txAdmin:events:playerDirectMessage", (eventData: { target: number; author: string; message: string }) => {
		const playerName = GetPlayerName(eventData.target);

		log("info", `txAdmin: Direct message from ${eventData.author} to ${playerName}`, {
			playerName,
			...eventData,
		});
	});

	on(
		"txAdmin:events:actionRevoked",
		(eventData: {
			actionId: string;
			actionType: "warn" | "ban";
			actionReason: string;
			actionAuthor: string;
			playerName: string;
			playerIds: string[];
			playerHwids: string[];
			revokedBy: string;
		}) => {
			const identifiers: FormattedPlayerIdentifiers = {};

			for (const identifier of eventData.playerIds) {
				const splitId = identifier.split(":");

				if (!splitId[0] || !splitId[1]) continue;
				if (config.logs.excludedPlayerIdentifiers.includes(splitId[0])) continue;

				identifiers[splitId[0] as IdentifierType] = splitId[1];
			}

			log("info", `txAdmin: Action revoked by ${eventData.revokedBy}`, {
				actionId: eventData.actionId,
				actionType: eventData.actionType,
				actionReason: eventData.actionReason,
				actionAuthor: eventData.actionAuthor,
				playerName: eventData.playerName,
				playerIds: identifiers,
				playerHwids: eventData.playerHwids,
				revokedBy: eventData.revokedBy,
			});
		}
	);

	on("txAdmin:events:skippedNextScheduledRestart", (eventData: { secondsRemaining: number; temporary: boolean }) => {
		log("info", "txAdmin: Scheduled restart skipped", eventData);
	});

	on("txAdmin:events:whitelistPlayer", (eventData: { action: "added" | "removed"; license: string; playerName: string; adminName: string }) => {
		log("info", `txAdmin: Player ${eventData.playerName} whitelist status changed`, eventData);
	});

	on("txAdmin:events:whitelistPreApproval", (eventData: { action: "added" | "removed"; license: string; playerName?: string; adminName: string }) => {
		log("info", "txAdmin: Player whitelist preapproval status changed", eventData);
	});

	on("txAdmin:events:whitelistRequest", (eventData: { action: "requested" | "approved" | "denied" | "deniedAll"; playerName?: string; requestId?: string; license?: string; adminName?: string }) => {
		log("info", "txAdmin: Whitelist request status changed", eventData);
	});

	on("txAdmin:events:adminAuth", (eventData: { netid: number; isAdmin: boolean; username?: string }) => {
		if (eventData.netid === -1) {
			log("info", "txAdmin: All admin auth invalidated");
		} else {
			const playerName = GetPlayerName(eventData.netid);
			log("info", `txAdmin: ${playerName} admin auth changed`, {
				playerName,
				...eventData,
			});
		}
	});
}
