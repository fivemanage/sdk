import { createId } from "@paralleldrive/cuid2";
import { startImageFeature } from "~/images/server/main";
import { validateConvars } from "~/utils/server/convars";

declare global {
	// biome-ignore lint: expected var
	var serverSessionId: string;
}

globalThis.serverSessionId = createId();

function boot() {
	validateConvars();
	startImageFeature();
}

boot();
