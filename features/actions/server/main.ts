import { v4 } from "uuid";
import { z } from "zod";

// Define the possible input types
export const InputType = z.enum([
  "string",
  "number",
  "boolean",
  "date",
  "daterange",
  "select",
  "textarea",
  "slider",
]);
type InputType = z.infer<typeof InputType>;

// Define the schema for action inputs
export const ActionInputSchema = z.object({
  name: z.string(),
  type: InputType,
  required: z.boolean(),
  description: z.string(),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});
export type ActionInput = z.infer<typeof ActionInputSchema>;

// Define the schema for actions
export const ActionSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.array(ActionInputSchema),
});
export type ActionDefinition = z.infer<typeof ActionSchema>;

// Define a type for the action function

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ActionFunction<T> = (inputs: T) => any;

// Define the complete Action type
export type Action<T> = ActionDefinition & { fn: ActionFunction<T> };

// Helper function to create a type-safe action
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function createAction<T extends Record<string, any>>(
  definition: ActionDefinition,
  fn: ActionFunction<T>
): Action<T> {
  return { ...definition, fn };
}

// Function to register an action
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function registerAction<T extends Record<string, any>>(action: Action<T>) {
  const actionId = v4();
  try {
    ActionSchema.parse(action);
    globalThis.actions[actionId] = action;
    console.log(`Registered action: ${action.name} with ID: ${actionId}`);
  } catch (error) {
    console.error(`Failed to register action ${action.name}:`, error);
  }
}

function registerExports() {
  exports("RegisterAction", registerAction);
}

export function startActionsFeature() {
  registerExports();

  // Example 1: Manage Vehicle (string, select, textarea)
  registerAction(
    createAction<{
      playerID: string;
      action: "spawn" | "repair" | "delete";
      vehicleModel?: string;
      color?: string;
      upgrades?: string;
    }>(
      {
        name: "manageVehicle",
        description: "Spawn, repair, or delete a vehicle for a player",
        inputSchema: [
          {
            name: "playerID",
            type: "string",
            required: true,
            description: "ID of the player",
          },
          {
            name: "action",
            type: "select",
            required: true,
            description: "Action to perform on the vehicle",
            options: ["spawn", "repair", "delete"],
          },
          {
            name: "vehicleModel",
            type: "string",
            required: false,
            description:
              "Model of the vehicle to spawn (required for 'spawn' action)",
          },
          {
            name: "color",
            type: "string",
            required: false,
            description: "Color of the vehicle (for 'spawn' action)",
          },
          {
            name: "upgrades",
            type: "textarea",
            required: false,
            description:
              "Comma-separated list of upgrades to apply (for 'spawn' action)",
          },
        ],
      },
      (inputs) => {
        const { playerID, action, vehicleModel, color, upgrades } = inputs;

        switch (action) {
          case "spawn":
            if (!vehicleModel) {
              throw new Error("Vehicle model is required for spawning");
            }
            console.log(`Spawning ${vehicleModel} for player ${playerID}`);
            if (color) {
              console.log(`Setting color to ${color}`);
            }
            if (upgrades) {
              const upgradeList = upgrades
                .split(",")
                .map((upgrade) => upgrade.trim());
              console.log(`Applying upgrades: ${upgradeList.join(", ")}`);
            }
            return { success: true, message: "Vehicle spawned successfully" };

          case "repair":
            console.log(`Repairing vehicle for player ${playerID}`);
            return { success: true, message: "Vehicle repaired successfully" };

          case "delete":
            console.log(`Deleting vehicle for player ${playerID}`);
            return { success: true, message: "Vehicle deleted successfully" };

          default:
            throw new Error("Invalid action");
        }
      }
    )
  );

  // Example 2: Set Weather (select, number, boolean)
  registerAction(
    createAction<{
      weatherType: string;
      intensity: number;
      immediate: boolean;
    }>(
      {
        name: "setWeather",
        description: "Set the weather conditions on the server",
        inputSchema: [
          {
            name: "weatherType",
            type: "select",
            required: true,
            description: "Type of weather to set",
            options: ["sunny", "rainy", "thunderstorm", "foggy", "snowy"],
          },
          {
            name: "intensity",
            type: "number",
            required: true,
            description: "Intensity of the weather (0-100)",
          },
          {
            name: "immediate",
            type: "boolean",
            required: true,
            description: "Whether to change the weather immediately",
          },
        ],
      },
      (inputs) => {
        const { weatherType, intensity, immediate } = inputs;
        console.log(
          `Setting weather to ${weatherType} with intensity ${intensity}`
        );
        console.log(`Immediate change: ${immediate}`);
        return { success: true, message: "Weather updated successfully" };
      }
    )
  );

  // Example 3: Schedule Event (date, daterange, slider)
  registerAction(
    createAction<{
      eventName: string;
      startDate: Date;
      eventDuration: { from: Date; to: Date };
      participantLimit: number;
    }>(
      {
        name: "scheduleEvent",
        description: "Schedule a new event on the server",
        inputSchema: [
          {
            name: "eventName",
            type: "string",
            required: true,
            description: "Name of the event",
          },
          {
            name: "startDate",
            type: "date",
            required: true,
            description: "Start date and time of the event",
          },
          {
            name: "eventDuration",
            type: "daterange",
            required: true,
            description: "Duration of the event",
          },
          {
            name: "participantLimit",
            type: "slider",
            required: true,
            description: "Maximum number of participants",
            min: 2,
            max: 100,
            step: 1,
          },
        ],
      },
      (inputs) => {
        const { eventName, startDate, eventDuration, participantLimit } =
          inputs;
        console.log(`Scheduling event: ${eventName}`);
        console.log(`Start: ${startDate}`);
        console.log(`Duration: ${eventDuration.from} to ${eventDuration.to}`);
        console.log(`Participant limit: ${participantLimit}`);
        return { success: true, message: "Event scheduled successfully" };
      }
    )
  );
}
