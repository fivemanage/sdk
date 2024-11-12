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
import { config } from "~/utils/common/config";
import { getErrorMessage } from "~/utils/common/misc";
import { convars } from "~/utils/server/convars";
import { registerRPCListener } from "~/utils/server/rpc";

const apiUrl = config.useStaging
  ? "https://api.stg.fivemanage.com/api/image"
  : "https://api.fivemanage.com/api/image";

const ImageUploadResponseSchema = object(
  {
    url: string("Image URL must be a string", [
      url("Image URL must be a valid URL"),
    ]),
  },
  "Image upload response is malformed"
);

async function uploadImage(
  data: string,
  metadata?: Record<string, unknown>
): Promise<ImageUploadResponse> {
  try {
    const form = new FormData();

    const base64String = data.split(",")[1] ?? "";
    const buffer = Buffer.from(base64String, "base64");

    form.append("image", buffer, "image.png");

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
  } catch (err) {
    throw new Error(`Failed to upload image to Fivemanage: ${err}`);
  }
}

async function requestClientScreenshot(
  playerSrc: string | number,
  metadata?: Record<string, unknown>,
  timeout?: number // Optional timeout parameter
): Promise<ImageUploadResponse> {
  // Validate playerSrc (must be a non-empty string or number)
  parse(
    union(
      [string([minLength(1)]), number()],
      "Player source must be a non-empty string or number"
    ),
    playerSrc
  );

  // Validate metadata (can be nullish or malformed record)
  parse(nullish(record(unknown(), "Image metadata is malformed")), metadata);

  return await new Promise((resolve, reject) => {
    // Handle the optional timeout, if provided
    let timeoutId: NodeJS.Timeout | undefined;

    if (timeout) {
      timeoutId = setTimeout(() => {
        reject(new Error("Screenshot request timed out"));
      }, timeout);
    }

    exports["screenshot-basic"]?.requestClientScreenshot?.(
      playerSrc,
      { encoding: "png", quality: 0.85 },
      async (_: false | string, data: string) => {
        try {
          if (timeoutId) clearTimeout(timeoutId); // Clear timeout on success
          const uploadResponse = await uploadImage(data, metadata);
          resolve(uploadResponse);
        } catch (error) {
          const errorMsg = getErrorMessage(error);
          console.error(errorMsg);
          reject(new Error(errorMsg)); // Properly reject the promise
        }
      }
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
    }
  );
}

function registerExports() {
  exports("takeServerImage", requestClientScreenshot);
}

export function startImageFeature() {
  registerRPCListeners();
  registerExports();
}
