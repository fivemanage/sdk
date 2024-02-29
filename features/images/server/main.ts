import FormData from "form-data";
import fetch from "node-fetch";
import {
	url,
	minLength,
	nullish,
	number,
	object,
	parse,
	record,
	string,
	union,
	unknown,
} from "valibot";
import type { ImageUploadResponse } from "~/images/common/misc";
import { getErrorMessage } from "~/utils/common/misc";
import { convars } from "~/utils/server/convars";
import { registerRPCListener } from "~/utils/server/rpc";

const apiUrl = "https://api.fivemanage.com/api/image";

const ImageUploadResponseSchema = object(
	{
		url: string("Image URL must be a string", [
			url("Image URL must be a valid URL"),
		]),
	},
	"Image upload response is malformed",
);

async function uploadImage(
	data: string,
	metadata?: Record<string, unknown>,
): Promise<ImageUploadResponse> {
	const buf = Buffer.from(data.split(",")[1] ?? "", "base64");
	const form = new FormData();

	form.append("image", buf, "image.png");

	if (metadata) {
		form.append("metadata", JSON.stringify(metadata));
	}

	const res = await fetch(apiUrl, {
		method: "POST",
		body: form,
		headers: {
			Authorization: convars.FIVEMANAGE_MEDIA_API_KEY,
		},
	});

	if (res.ok === false) {
		throw new Error("Failed to upload image to Fivemanage");
	}

	const resData = parse(ImageUploadResponseSchema, await res.json());

	return resData;
}

async function requestClientScreenshot(
	playerSrc: string | number,
	metadata?: Record<string, unknown>,
): Promise<ImageUploadResponse> {
	parse(
		union(
			[string([minLength(1)]), number()],
			"Player source must be a non-empty string or number",
		),
		playerSrc,
	);

	parse(nullish(record(unknown(), "Image metadata is malformed")), metadata);

	return await new Promise((resolve) => {
		exports["screenshot-basic"]?.requestClientScreenshot?.(
			playerSrc,
			{ encoding: "png", quality: 0.85 },
			async (_: false | string, data: string) => {
				resolve(await uploadImage(data, metadata));
			},
		);
	});
}

function registerRPCListeners() {
	registerRPCListener<Record<string, unknown> | undefined, ImageUploadResponse>(
		"fivemanage:takeImage",
		async (req, res) => {
			try {
				const data = await requestClientScreenshot(req.source, req.data);

				res({ success: true, data });
			} catch (error) {
				const errorMsg = getErrorMessage(error);

				console.error(errorMsg);

				res({ success: false, errorMsg });
			}
		},
	);
}

function registerExports() {
	exports("takeServerImage", requestClientScreenshot);
}

export function startImageFeature() {
	registerRPCListeners();
	registerExports();
}
