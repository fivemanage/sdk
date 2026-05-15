import type { ImageUploadOptions, ImageUploadResponse } from "~/images/common/misc";
import { triggerServerRPC } from "~/utils/client/rpc";

async function takeImage(
	metadata?: Record<string, unknown>,
	options?: ImageUploadOptions,
): Promise<ImageUploadResponse> {
	const res = await triggerServerRPC<
		{ metadata?: Record<string, unknown>; options?: ImageUploadOptions },
		ImageUploadResponse
	>("fivemanage:takeImage", { metadata, options });

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