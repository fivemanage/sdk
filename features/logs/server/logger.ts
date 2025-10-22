import { createLogger, transports, format } from "winston";
import { config } from "~/utils/common/config";
import { LogColor, type _InternalOptions, type LogMetadata } from "~/logs/common/misc";
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
import { loadLogsConvar } from "~/utils/server/convars";

import './player'
import './chat';
import './txadmin'
import './baseevents'

const levels = config.logs.levels.reduce<Record<string, number>>(
	(acc, curr, idx) => {
		acc[curr] = idx;
		return acc;
	},
	{},
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
					`[^3${info.timestamp}^7] [^5${info.resource}^7] [${LogColor[info.level as keyof typeof LogColor] ?? "^7"
					}${info.level.toUpperCase()}^7]: ${info.message}`,
			),
		),
	});

	logger.add(consoleTransport);
}

if (config.logs.enableCloudLogging === true) {
	logger.add(
		new FivemanageTransport({
			apiKey: loadLogsConvar()
		}),
	);
}

const LogSchema = object({
	level: string([minLength(1)]),
	message: string([minLength(1)]),
	metadata: record(unknown()),
});

function processMetadata(metadata: LogMetadata): LogMetadata {
	const meta: LogMetadata = { ...metadata };

	if (config.logs.appendPlayerIdentifiers) {
		if (meta.playerSource) {
			meta._playerIdentifiers = getFormattedPlayerIdentifiers(meta.playerSource);
		}
		if (meta.targetSource) {
			meta._targetIdentifiers = getFormattedPlayerIdentifiers(meta.targetSource);
		}
	}

	return meta;
}

function executeLog(level: string, message: string, metadata: LogMetadata, datasetId: string, _internalOpts?: _InternalOptions) {
	try {
		parse(LogSchema, { level, message, metadata });

		const meta = processMetadata(metadata);
		const resourceName = GetInvokingResource() || "Unknown Resource";

		if (!GetInvokingResource()) {
			console.warn("Could not identify the invoking resource for this log message. This usually happens when the log export is called from a cross-network event (e.g., Server ↔ Client). This will NOT affect the log, however it will just show the resource as 'Unknown Resource'.");
		}

		logger.log(level, message, {
			resource: _internalOpts?._internal_RESOURCE ?? resourceName,
			metadata: meta,
			datasetId,
		});
	} catch (error) {
		if (error instanceof ValiError) {
			console.error("Invalid log params:\n", flatten<typeof LogSchema>(error).nested);
			return;
		}
		console.error("Error executing log", error);
	}
}

export function log(level: string, message: string, metadata: LogMetadata = {}, _internalOpts?: _InternalOptions) {
	const meta = {
		...metadata,
		serverSessionId: config.logs.excludeInDepthMetadata ? null : globalThis.serverSessionId,
	};
	executeLog(level, message, meta, "default", _internalOpts);
}

export function ingest(datasetId: string, level: string, message: string, metadata: LogMetadata = {}, _internalOpts?: _InternalOptions) {
	const meta = {
		...metadata,
		serverSessionId: config.logs.excludeInDepthMetadata ? null : globalThis.serverSessionId,
	};
	executeLog(level, message, meta, datasetId, _internalOpts);
}

export function info(datasetId: string, message: string, metadata: LogMetadata = {}, _internalOpts?: _InternalOptions) {
	ingest(datasetId, "info", message, metadata, _internalOpts);
}

export function warn(datasetId: string, message: string, metadata: LogMetadata = {}, _internalOpts?: _InternalOptions) {
	ingest(datasetId, "warn", message, metadata, _internalOpts);
}

export function error(datasetId: string, message: string, metadata: LogMetadata = {}, _internalOpts?: _InternalOptions) {
	ingest(datasetId, "error", message, metadata, _internalOpts);
}

function registerExports() {
	exports("LogMessage", log);
	exports("Log", ingest);
	exports("Info", info);
	exports("Warn", warn);
	exports("Error", error);
}

export function startLogsFeature() {
	registerExports();
}