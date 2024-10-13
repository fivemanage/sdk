import { config } from "~/utils/common/config";
import { log } from "./logger";

if (config.logs.playerEvents) {
	on("playerConnecting", (name: string) => {
		const _source = global.source;
	
		log("info", `Player ${name} is connecting`, {
			playerSource: _source,
			playerName: name,
		})
	});

	on("playerDropped", (reason: string) => {
		const _source = global.source;
		const playerName = GetPlayerName(_source.toString())
	
		log("info", `Player ${playerName} dropped`, {
			playerSource: _source,
			playerName,
			reason: reason,
		})
	});


    on("playerJoining", (source: string) => {
		const _source = global.source;
		const playerName = GetPlayerName(_source.toString());
        log("info", `Player ${playerName} is joining`, {
            playerSource: source,
            playerName,
        })
    })
}