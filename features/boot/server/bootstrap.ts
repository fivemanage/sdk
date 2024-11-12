import { createId } from "@paralleldrive/cuid2";
import { startHttpFeature } from "~/http/server/main";
import { startImageFeature } from "~/images/server/main";
import { startLogsFeature } from "~/logs/server/logger";
import { startPresignedFeature } from "~/presigned/server/main";
import { registerSdk } from "~/sdk/server/main";

declare global {
  // biome-ignore lint: expected var
  var serverSessionId: string;
  // biome-ignore lint: expected var
  var sdkToken: string | undefined;
}

globalThis.serverSessionId = createId();

async function boot() {
  const sdkToken = await registerSdk();

  if (sdkToken) {
    globalThis.sdkToken = sdkToken;

    startHttpFeature();
  }

  startImageFeature();
  startLogsFeature();
  startPresignedFeature();
}

boot();
