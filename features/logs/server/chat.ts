import { config } from "~/utils/common/config";
import { log } from "./logger";

if (config.logs.chatEvents) {
    onNet('chatMessage', (src: number, playerName: string, content: string)=>{
        log("info", `chat message from ${playerName}`, {
            playerSource: src,
            chatMessage: content,
            playerName: playerName,
        });
    })
}