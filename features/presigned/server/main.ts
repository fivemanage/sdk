import { object, parse, string, url, picklist } from "valibot";
import { convars } from "~/utils/server/convars";
import fetch from "node-fetch";

const API_URL = "https://fmapi.net/api/v2/presigned-url";

const PresignedRequestSchema = picklist(
  ["image", "audio", "video"],
  'File type must be one of "image", "audio" or "video"',
);

type PresignedResponse = {
  status: string;
  data: {
    presignedUrl: string;
  };
};

const PresignedResponseSchema = object(
  {
    status: string("Status must be a string"),
    data: object({
      presignedUrl: string("Presigned URL must be a string"),
    }),
  },
  "Presigned response is malformed",
);

async function requestPresignedUrl(
  fileType: string,
): Promise<PresignedResponse["data"]["presignedUrl"]> {
  const parsedFileType = parse(PresignedRequestSchema, fileType);

  const res = await fetch(`${API_URL}?fileType=${parsedFileType}`, {
    method: "GET",
    headers: {
      Authorization: convars.FIVEMANAGE_MEDIA_API_KEY,
    },
  });

  if (!res.ok) throw new Error("Failed to request presigned url");

  const { data } = parse(PresignedResponseSchema, await res.json());

  return data.presignedUrl;
}

function registerExports() {
  exports("requestPresignedUrl", requestPresignedUrl);
}

export function startPresignedFeature() {
  registerExports();
}
