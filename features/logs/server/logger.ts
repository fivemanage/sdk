import { createLogger, transports, format } from "winston";
import { config } from "~/utils/common/config";
import {
  LogColor,
  type _InternalOptions,
  type LogMetadata,
} from "~/logs/common/misc";
import { FivemanageTransport } from "@fivemanage/winston";
import { getFormattedPlayerIdentifiers } from "~/utils/server/identifiers";
import {
  minLength,
  object,
  parse,
  record,
  string,
  unknown,
  ValiError,
  flatten,
} from "valibot";
import { convars } from "~/utils/server/convars";

import "./player";
import "./chat";
import "./txadmin";

const levels = config.logs.levels.reduce<Record<string, number>>(
  (acc, curr, idx) => {
    acc[curr] = idx;
    return acc;
  },
  {}
);

const logger = createLogger({
  level: config.logs.level,
  levels,
  exitOnError: false,
});

if (config.logs.console === true) {
  const consoleTransport = new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.printf(
        (info) =>
          `[^3${info.timestamp}^7] [^5${info.resource}^7] [${
            LogColor[info.level as keyof typeof LogColor] ?? "^7"
          }${info.level.toUpperCase()}^7]: ${info.message}`
      )
    ),
  });

  logger.add(consoleTransport);
}

if (config.logs.enableCloudLogging === true) {
  logger.add(
    new FivemanageTransport({
      apiKey: convars.FIVEMANAGE_LOGS_API_KEY,
    })
  );
}

const LogSchema = object({
  level: string([minLength(1)]),
  message: string([minLength(1)]),
  metadata: record(unknown()),
});

export function log(
  level: string,
  message: string,
  metadata: LogMetadata = {},
  _internalOpts?: _InternalOptions
) {
  try {
    parse(LogSchema, { level, message, metadata });

    const meta: LogMetadata = {
      ...metadata,
      _resourceName: GetInvokingResource(),
      _serverSessionId: globalThis.serverSessionId,
    };

    if (config.logs.appendPlayerIdentifiers) {
      if (meta.playerSource) {
        meta._playerIdentifiers = getFormattedPlayerIdentifiers(
          meta.playerSource
        );
      }

      if (meta.targetSource) {
        meta._targetIdentifiers = getFormattedPlayerIdentifiers(
          meta.targetSource
        );
      }
    }

    logger.log(level, message, {
      resource: _internalOpts?._internal_RESOURCE ?? meta._resourceName,
      metadata: meta,
    });
  } catch (error) {
    if (error instanceof ValiError) {
      console.error(
        "Invalid log params:\n",
        flatten<typeof LogSchema>(error).nested
      );

      return;
    }

    console.error("Error executing log", error);
  }
}

function registerExports() {
  exports("LogMessage", log);
}

export function startLogsFeature() {
  registerExports();
}
