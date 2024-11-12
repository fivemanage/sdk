import { v4 } from "uuid";

export interface ActionInput {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Action<Input> {
  name: string;
  description: string;
  inputSchema: Array<ActionInput>;
  fn: (inputs: Input) => void;
}

function registerAction<T>(action: Action<T>) {
  const actionId = v4();
  globalThis.actions[actionId] = action;
}

function registerExports() {
  exports("RegisterAction", registerAction);
}

export function startActionsFeature() {
  registerExports();

  registerAction<{ playerID: string; reason?: string }>({
    name: "kickPlayer",
    description: "Kicks a player from the server.",
    inputSchema: [
      {
        name: "playerID",
        type: "string",
        required: true,
        description: "ID of the player to be kicked",
      },
      {
        name: "reason",
        type: "string",
        required: false,
        description: "Reason for kicking the player",
      },
    ],
    fn: (inputs) => {
      const playerID = inputs.playerID;
      const reason = inputs.reason || "No reason provided";

      // Ensure DropPlayer is defined or imported
      DropPlayer(playerID, reason);
      console.log(`Player ${playerID} has been kicked for: ${reason}`);
    },
  });
}
