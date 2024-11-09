import { convars } from "~/utils/server/convars";
import { z } from "zod";

import { FivemanageClient } from "@fivemanage/sdk";

const client = new FivemanageClient(convars.FIVEMANAGE_MEDIA_API_KEY);

const presignedRequestSchema = z.enum(["image", "audio", "video"]);
const presignedResponseSchema = z.object({ presignedUrl: z.string().min(1) });

async function requestPresignedUrl(fileType: string): Promise<string> {
  const parsedFileType = presignedRequestSchema.parse(fileType);
  const res = await client.getPresignedUrl(parsedFileType);

  return presignedResponseSchema.parse(res).presignedUrl;
}

function registerExports() {
  exports("requestPresignedUrl", requestPresignedUrl);
}

export function startPresignedFeature() {
  registerExports();
}
