import { createId } from "@paralleldrive/cuid2";
import { startActionsFeature, type Action } from "~/actions/server/main";
import { startHttpFeature } from "~/http/server/main";
import { startImageFeature } from "~/images/server/main";
import { startLogsFeature } from "~/logs/server/logger";
import { startPresignedFeature } from "~/presigned/server/main";
import { invalidateSDKResource, registerSdk } from "~/sdk/server/main";

declare global {
  // biome-ignore lint: expected var
  var serverSessionId: string;

  // biome-ignore lint: expected var
  var sdkToken: string | undefined;

  // biome-ignore lint/style/noVar: <explanation>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  var actions: Record<string, Action<any>>;
}

globalThis.serverSessionId = createId();
globalThis.actions = {};

on("onResourceStart", async (resourceName: string) => {
  if(GetCurrentResourceName() != resourceName) return;
  
  await invalidateSDKResource()

  if (!globalThis.sdkToken) {
    const sdkToken = await registerSdk();
    if (sdkToken) {
      globalThis.sdkToken = sdkToken;
    }
  }

  startHttpFeature();
  startActionsFeature();
});

async function boot() {
  startImageFeature();
  startLogsFeature();
  startPresignedFeature();
}

boot();