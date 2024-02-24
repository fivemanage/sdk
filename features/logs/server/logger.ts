import { createLogger, transports, format } from "winston";
import { config } from "~/utils/common/config";
import { LogColor, type LogLevels, type LogMetadata } from "~/logs/common/misc";
import { FivemanageTransport } from "~/logs/server/transport";
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

const logger = createLogger({
	level: config.logs.level,
	exitOnError: false,
});

if (config.logs.console === true) {
	const consoleTransport = new transports.Console({
		format: format.combine(
			format.timestamp(),
			format.printf(
				(info) =>
					`[^3${info.timestamp}^7] [^5${info._resourceName}^7] [${
						LogColor[info.level as keyof typeof LogColor]
					}${info.level.toUpperCase()}^7]: ${info.message}`,
			),
		),
	});

	logger.add(consoleTransport);
}

if (config.logs.enableCloudLogging === true) {
	logger.add(new FivemanageTransport());
}

const LogSchema = object({
	level: string([minLength(1)]),
	message: string([minLength(1)]),
	metadata: record(unknown()),
});

function log(level: LogLevels, message: string, metadata: LogMetadata = {}) {
	try {
		parse(LogSchema, { level, message, metadata });

		const meta: LogMetadata = {
			...metadata,
			_resourceName: GetInvokingResource(),
			_serverSessionId: globalThis.serverSessionId,
		};

		if (config.logs.appendPlayerIdentifiers && meta.playerSource) {
			meta._identifiers = getFormattedPlayerIdentifiers(
				typeof meta.playerSource === "string"
					? meta.playerSource
					: meta.playerSource.toString(),
			);
		}

		logger.log(level, message, { resource: meta._resourceName, metadata });
	} catch (error) {
		if (error instanceof ValiError) {
			console.error(
				"Invalid log params:\n",
				flatten<typeof LogSchema>(error).nested,
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
