import { config } from "~/utils/common/config";
import { ingest } from "./logger";

if (config.logs.playerEvents.enabled) {
	const dataset = config.logs.playerEvents.dataset;

	on("playerConnecting", (name: string) => {
		const _source = global.source;
	
		ingest(dataset, "info", `player ${name} is connecting`, {
			playerSource: _source,
			playerName: name,
		})
	});

	on("playerDropped", (reason: string) => {
		const _source = global.source;
		const playerName = GetPlayerName(_source.toString())
	
		ingest(dataset, "info", `player ${playerName} dropped`, {
			playerSource: _source,
			playerName,
			reason: reason,
		})
	});


    on("playerJoining", (source: string) => {
		const _source = global.source;
		const playerName = GetPlayerName(_source.toString());
        ingest(dataset, "info", `player ${playerName} is joining`, {
            playerSource: source,
            playerName,
        })
    })
}