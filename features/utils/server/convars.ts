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

export const convars = loadConvars();
