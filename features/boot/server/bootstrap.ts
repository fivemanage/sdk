import { createId } from "@paralleldrive/cuid2";
import { startImageFeature } from "~/images/server/main";
import { startLogsFeature } from "~/logs/server/logger";
import { startPresignedFeature } from "~/presigned/server/main";

declare global {
	// biome-ignore lint: expected var
	var serverSessionId: string;
}

globalThis.serverSessionId = createId();

function boot() {
	startImageFeature();
	startLogsFeature();
	startPresignedFeature();
}

boot();
