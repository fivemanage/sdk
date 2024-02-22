import {
	type Output,
	ValiError,
	minLength,
	object,
	parse,
	string,
} from "valibot";

const ConvarSchema = object({
	FIVEMANAGE_LOGS_API_KEY: string([minLength(1)]),
	FIVEMANAGE_MEDIA_API_KEY: string([minLength(1)]),
});
type Convars = Output<typeof ConvarSchema>;

export const convars: Convars = {
	FIVEMANAGE_LOGS_API_KEY: GetConvar("FIVEMANAGE_LOGS_API_KEY", ""),
	FIVEMANAGE_MEDIA_API_KEY: GetConvar("FIVEMANAGE_MEDIA_API_KEY", ""),
};

export function validateConvars() {
	try {
		parse(ConvarSchema, convars);
	} catch (error) {
		if (error instanceof ValiError) {
			const issues = error.issues.map((issue) => [
				issue.path?.[0].key,
				issue.message,
			]);

			console.error("❌ Invalid configuration variables:\n", issues);

			throw new Error("Invalid configuration variables");
		}
	}
}
