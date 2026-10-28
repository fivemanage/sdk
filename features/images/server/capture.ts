import { getErrorMessage } from "~/utils/common/misc";

type CaptureCallback = (error: unknown, data?: unknown) => void;

interface CaptureProvider {
  name: "screencapture" | "screenshot-basic";
  capture: (playerSrc: string | number, callback: CaptureCallback) => void;
}

const missingProviderMessage = "Screen capture requires screencapture or screenshot-basic to be started before the SDK";
let captureProvider: CaptureProvider | undefined;

export function initializeCaptureProvider() {
  if (GetResourceState("screencapture") === "started") {
    captureProvider = {
      name: "screencapture",
      capture(playerSrc, callback) {
        if (!exports.screencapture?.serverCapture) {
          throw new Error("screencapture serverCapture export is unavailable");
        }
        exports.screencapture.serverCapture(
          playerSrc,
          { encoding: "webp" },
          (data: unknown) => callback(false, data),
          "base64",
        );
      },
    };
  } else if (GetResourceState("screenshot-basic") === "started") {
    captureProvider = {
      name: "screenshot-basic",
      capture(playerSrc, callback) {
        if (!exports["screenshot-basic"]?.requestClientScreenshot) {
          throw new Error("screenshot-basic requestClientScreenshot export is unavailable");
        }
        exports["screenshot-basic"].requestClientScreenshot(
          playerSrc,
          { encoding: "webp", quality: 0.8 },
          callback,
        );
      },
    };
  } else {
    captureProvider = undefined;
    console.error(`[fmsdk] ${missingProviderMessage}`);
  }
}

export async function captureClientImage(
  playerSrc: string | number,
  timeout?: number,
): Promise<string> {
  const provider = captureProvider;
  if (!provider) {
    throw new Error(missingProviderMessage);
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let timeoutId: NodeJS.Timeout | undefined;

    const finish = (error: unknown, data?: unknown) => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);

      if (error) {
        reject(new Error(getErrorMessage(error)));
      } else if (typeof data !== "string" || !/^data:image\/[\w.+-]+;base64,[\s\S]+$/.test(data)) {
        reject(new Error(`${provider.name} returned invalid screenshot data`));
      } else {
        resolve(data);
      }
    };

    if (timeout) {
      timeoutId = setTimeout(() => {
        finish(new Error("Screenshot request timed out"));
      }, timeout);
    }

    try {
      provider.capture(playerSrc, finish);
    } catch (error) {
      finish(new Error(getErrorMessage(error)));
    }
  });
}
