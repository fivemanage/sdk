import {
	type Output,
	ValiError,
	boolean,
	string,
	array,
	minLength,
	flatten,
	object,
	parse,
} from "valibot";

const ConfigSchema = object({
	logs: object({
		level: string([minLength(1)]),
		levels: array(string([minLength(1)])),
		console: boolean(),
		enableCloudLogging: boolean(),
		appendPlayerIdentifiers: boolean(),
		excludedPlayerIdentifiers: array(string([minLength(1)])),
		playerEvents: boolean(),
		chatEvents: boolean(),
		txAdminEvents: boolean(),
	}),
});

function loadConfig(): Output<typeof ConfigSchema> {
	try {
		const config = parse(
			ConfigSchema,
			JSON.parse(LoadResourceFile(GetCurrentResourceName(), "config.json")),
		);

		if (config.logs.levels.includes(config.logs.level) === false) {
			console.error(
				"Invalid config settings, logs.level must be in logs.levels",
			);

			throw new Error();
		}

		return config;
	} catch (error) {
		if (error instanceof ValiError) {
			console.error(
				"❌ Invalid config settings:\n",
				flatten<typeof ConfigSchema>(error).nested,
			);

			throw new Error("Invalid config settings");
		}

		throw new Error("Error loading config");
	}
}

export const config = loadConfig();
