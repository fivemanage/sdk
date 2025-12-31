import { config } from "~/utils/common/config";
import { ingest } from "./logger";

if (config.logs.chatEvents.enabled) {
    const dataset = config.logs.chatEvents.dataset;

    onNet('chatMessage', (src: number, playerName: string, content: string)=>{
        ingest(dataset, "info", `chat message from ${playerName}`, {
            playerSource: src,
            chatMessage: content,
            playerName: playerName,
        });
    })
}