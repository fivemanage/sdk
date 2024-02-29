import type { ImageUploadResponse } from "~/images/common/misc";
import { triggerServerRPC } from "~/utils/client/rpc";

async function takeImage(
	metadata?: Record<string, unknown>,
): Promise<ImageUploadResponse> {
	const res = await triggerServerRPC<
		Record<string, unknown> | undefined,
		ImageUploadResponse
	>("fivemanage:takeImage", metadata);

	if (res.success === false) {
		throw new Error(res.errorMsg);
	}

	return res.data;
}

function registerExports() {
	exports("takeImage", takeImage);
}

export function startImageFeature() {
	registerExports();
}
