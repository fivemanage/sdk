import { object, parse, string, url, picklist } from "valibot";
import { convars } from "~/utils/server/convars";
import fetch from "node-fetch";
import { config } from "~/utils/common/config";

const API_URL = config.useStaging
  ? "https://api.stg.fivemanage.com/api/presigned-url"
  : "https://api.fivemanage.com/api/presigned-url";

const PresignedRequestSchema = picklist(
  ["image", "audio", "video"],
  'File type must be one of "image", "audio" or "video"'
);

type PresignedResponse = {
  presignedUrl: string;
};

const PresignedResponseSchema = object(
  {
    presignedUrl: string("Image URL must be a string", [
      url("Image URL must be a valid URL"),
    ]),
  },
  "Presigned response is malformed"
);

async function requestPresignedUrl(
  fileType: string
): Promise<PresignedResponse["presignedUrl"]> {
  const parsedFileType = parse(PresignedRequestSchema, fileType);

  const res = await fetch(`${API_URL}?fileType=${parsedFileType}`, {
    method: "GET",
    headers: {
      Authorization: convars.FIVEMANAGE_MEDIA_API_KEY,
    },
  });

  if (!res.ok) throw new Error("Failed to request presigned url");

  const { presignedUrl } = parse(PresignedResponseSchema, await res.json());

  return presignedUrl;
}

function registerExports() {
  exports("requestPresignedUrl", requestPresignedUrl);
}

export function startPresignedFeature() {
  registerExports();
}
