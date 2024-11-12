import { config } from "~/utils/common/config";
import { log } from "./logger";

type BaseEvent = {
  author: string;
  message: string;
};

type ScheduledRestart = {
  secondsRemaining: number;
  translatedMessage: string;
};

type PlayerKicked = {
  target: number;
  author: string;
  reason: string;
};

type PlayerWarned = {
  author: string;
  reason: string;
  actionId: number;
  targetNetId: number;
  targetIds: Array<string>;
  targetName: string;
};

type PlayerBanned = {
  author: string;
  reason: string;
  actionId: string;
  expiration: string;
  durationInput: string;
  durationTranslated: string;
  targetNetId: number;
  targetIds: string;
  targetHwids: string;
  targetName: string;
  kickMessage: string;
};

type PlayerDirectMessage = BaseEvent & {
  target: number;
};

type WhitelistPlayer = {
  action: string;
  license: string;
  playerName: string;
  adminName: string;
};

if (config.logs.txAdminEvents) {
  on("txAdmin:events:scheduledRestart", (data: ScheduledRestart) => {
    log(
      "info",
      `The server has been scheduled to restart in ${data.secondsRemaining} second(s)`,
      {
        event: "txAdmin:events:scheduledRestart",
        announcementMessage: data.translatedMessage,
      }
    );
  });

  on("txAdmin:events:playerKicked", (data: PlayerKicked) => {
    const playerName = GetPlayerName(data.target.toString());
    log("info", `Admin ${data.author} kicked ${playerName} from the server`, {
      reason: data.reason ?? "No reason",
      targetSource: data.target.toString(),
      event: "txAdmin:events:playerKicked",
      admin: data.author,
    });
  });

  on("txAdmin:events:playerWarned", (data: PlayerWarned) => {
    log(
      "info",
      `Player ${data.targetName} warned for: ${data.reason} by ${data.author}`,
      {
        event: "txAdmin:events:playerWarned",
        identifiers: data.targetIds,
        playerName: data.targetName,
        admin: data.author,
        reason: data.reason ?? "No reason",
        actionId: data.actionId,
      }
    );
  });

  on("txAdmin:events:playerBanned", (data: PlayerBanned) => {
    log("info", `Player ${data.targetName} banned by ${data.author}`, {
      event: "txAdmin:events:playerBanned",
      admin: data.author,
      expiration: data.expiration,
      playerName: data.targetName,
      reason: data.reason,
      identifiers: data.targetIds,
      hardwareIds: data.targetHwids,
      kickMessage: data.kickMessage,
      actionId: data.actionId,
    });
  });

  on("txAdmin:events:announcement", (data: BaseEvent) => {
    log("info", `New announcement: ${data.message} by ${data.author}`, {
      event: "txAdmin:events:announcement",
      admin: data.author,
      message: data.message,
    });
  });

  on("txAdmin:events:serverShuttingDown", (data: BaseEvent) => {
    log("info", "Server is shutting down", {
      event: "txAdmin:events:serverShuttingDown",
      admin: data.author,
      message: data.message,
    });
  });

  on("txAdmin:events:playerDirectMessage", (data: PlayerDirectMessage) => {
    const playerName = GetPlayerName(data.target.toString());
    log("info", `Direct message sent to ${playerName} from ${data.author}`, {
      event: "txAdmin:events:playerDirectMessage",
      targetSource: data.target.toString(),
      admin: data.author,
      message: data.message,
    });
  });

  on("txAdmin:events:whitelistPlayer", (data: WhitelistPlayer) => {
    log("info", `Whitelist for player ${data.playerName} was ${data.action}`, {
      event: "txAdmin:events:whitelistPlayer",
      adminName: data.adminName,
      action: data.action,
      playerName: data.playerName,
      license: data.license,
    });
  });
}
