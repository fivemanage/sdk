import {
	type Output,
	ValiError,
	boolean,
	enum_,
	flatten,
	object,
	parse,
} from "valibot";
import { LogLevel } from "~/logs/common/misc";

const ConfigSchema = object({
	logs: object({
		level: enum_(LogLevel),
		console: boolean(),
		enableCloudLogging: boolean(),
		appendPlayerIdentifiers: boolean(),
	}),
});

function loadConfig(): Output<typeof ConfigSchema> {
	try {
		const config = JSON.parse(
			LoadResourceFile(GetCurrentResourceName(), "config.json"),
		);

		return parse(ConfigSchema, config);
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
