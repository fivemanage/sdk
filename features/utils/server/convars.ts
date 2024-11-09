import { z, ZodError } from "zod";

const convarSchema = z.object({
  FIVEMANAGE_LOGS_API_KEY: z
    .string()
    .min(1, "FIVEMANAGE_LOGS_API_KEY must be provided."),
  FIVEMANAGE_MEDIA_API_KEY: z
    .string()
    .min(1, "FIVEMANAGE_MEDIA_API_KEY must be provided."),
});

function loadConvars(): z.infer<typeof convarSchema> {
  try {
    const convars = {
      FIVEMANAGE_LOGS_API_KEY: GetConvar("FIVEMANAGE_LOGS_API_KEY", ""),
      FIVEMANAGE_MEDIA_API_KEY: GetConvar("FIVEMANAGE_MEDIA_API_KEY", ""),
    };

    return convarSchema.parse(convars);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        "❌ Invalid configuration variables:\n",
        error.errors.map((err) => err.message).join(", ")
      );

      throw new Error("Invalid configuration variables");
    }

    throw new Error("Error loading configuration variables");
  }
}

export const convars = loadConvars();
