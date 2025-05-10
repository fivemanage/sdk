import {
	type Output,
	ValiError,
	flatten,
	minLength,
	object,
	parse,
	string,
} from "valibot";

const ConvarSchema = object({
	FIVEMANAGE_LOGS_API_KEY: string([
		minLength(1, "FIVEMANAGE_LOGS_API_KEY must be provided."),
	]),
	FIVEMANAGE_MEDIA_API_KEY: string([
		minLength(1, "FIVEMANAGE_MEDIA_API_KEY must be provided."),
	]),
});

export const FIVEMANAGE_LOGS_API_KEY = string([
	minLength(1, "FIVEMANAGE_LOGS_API_KEY must be provided."),
]);

export const FIVEMANAGE_MEDIA_API_KEY = string([
	minLength(1, "FIVEMANAGE_MEDIA_API_KEY must be provided."),
]);

function loadConvars(): Output<typeof ConvarSchema> {
	try {
		const convars = {
			FIVEMANAGE_LOGS_API_KEY: GetConvar("FIVEMANAGE_LOGS_API_KEY", ""),
			FIVEMANAGE_MEDIA_API_KEY: GetConvar("FIVEMANAGE_MEDIA_API_KEY", ""),
		};

		return parse(ConvarSchema, convars);
	} catch (error) {
		if (error instanceof ValiError) {
			console.error(
				"❌ Invalid configuration variables:\n",
				flatten<typeof ConvarSchema>(error).nested,
			);

			throw new Error("Invalid configuration variables");
		}

		throw new Error("Error loading configuration variables");
	}
}

export function loadLogsConvar(): Output<typeof FIVEMANAGE_LOGS_API_KEY> {
	try {
		return parse(FIVEMANAGE_LOGS_API_KEY, GetConvar("FIVEMANAGE_LOGS_API_KEY", ""));
	}
	catch (error) {
		if (error instanceof ValiError) {
			console.error(
				"❌ Invalid FIVEMANAGE_LOGS_API_KEY configuration variable:\n",
				flatten<typeof FIVEMANAGE_LOGS_API_KEY>(error).nested,
			);

			throw new Error("Invalid FIVEMANAGE_LOGS_API_KEY");
		}

		throw new Error("Error loading FIVEMANAGE_LOGS_API_KEY");
	}
}

export function loadMediaConvar(): Output<typeof FIVEMANAGE_MEDIA_API_KEY> {
	try {
		return parse(FIVEMANAGE_MEDIA_API_KEY, GetConvar("FIVEMANAGE_MEDIA_API_KEY", ""));
	}
	catch (error) {
		if (error instanceof ValiError) {
			console.error(
				"❌ Invalid FIVEMANAGE_MEDIA_API_KEY configuration variable:\n",
				flatten<typeof FIVEMANAGE_MEDIA_API_KEY>(error).nested,
			);

			throw new Error("Invalid FIVEMANAGE_MEDIA_API_KEY");
		}

		throw new Error("Error loading FIVEMANAGE_MEDIA_API_KEY");
	}
}
