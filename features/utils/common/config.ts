import { z, ZodError } from "zod";

const configSchema = z.object({
  logs: z.object({
    level: z.string().min(1),
    levels: z.array(z.string().min(1)),
    console: z.boolean(),
    enableCloudLogging: z.boolean(),
    appendPlayerIdentifiers: z.boolean(),
    excludedPlayerIdentifiers: z.array(z.string().min(1)),
    playerEvents: z.boolean(),
    chatEvents: z.boolean(),
    txAdminEvents: z.boolean(),
  }),
});

function loadConfig(): z.infer<typeof configSchema> {
  try {
    const config = configSchema.parse(
      JSON.parse(LoadResourceFile(GetCurrentResourceName(), "config.json"))
    );

    if (config.logs.levels.includes(config.logs.level) === false) {
      console.error(
        "Invalid config settings, logs.level must be in logs.levels"
      );

      throw new Error();
    }

    return config;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        "❌ Invalid config settings:\n",
        error.errors.map((err) => err.message).join(", ")
      );

      throw new Error("Invalid config settings");
    }

    throw new Error("Error loading config");
  }
}

export const config = loadConfig();
