import {
	type Output,
	ValiError,
	flatten,
	minLength,
	parse,
	string,
} from "valibot";

export const FIVEMANAGE_LOGS_API_KEY = string([
	minLength(1, "FIVEMANAGE_LOGS_API_KEY must be provided."),
]);

export const FIVEMANAGE_MEDIA_API_KEY = string([
	minLength(1, "FIVEMANAGE_MEDIA_API_KEY must be provided."),
]);

export function loadLogsConvar(): Output<typeof FIVEMANAGE_LOGS_API_KEY> {
	try {
		const apiKey = GetConvar("FIVEMANAGE_LOGS_API_KEY", "");
		return parse(FIVEMANAGE_LOGS_API_KEY, apiKey);
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
		const apiKey = GetConvar("FIVEMANAGE_MEDIA_API_KEY", "");
		return parse(FIVEMANAGE_MEDIA_API_KEY, apiKey);
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
