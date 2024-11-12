import fetch from "node-fetch";
import { config } from "~/utils/common/config";
import { convars } from "~/utils/server/convars";

const API_URL = config.useStaging
  ? "https://api.stg.fivemanage.com/api/sdk"
  : "https://api.fivemanage.com/api/sdk";

export async function registerSdk(): Promise<string | undefined> {
  const endpoint = GetConvar("web_baseUrl", "");
  const resourceName = GetCurrentResourceName();

  try {
    const initialResponse = await fetch(
      `${API_URL}/report?sdkType=fivem&endpoint=${endpoint}&resourceName=${resourceName}`,
      {
        method: "POST",
        headers: {
          Authorization: convars.FIVEMANAGE_MEDIA_API_KEY,
        },
      }
    );

    console.log("[^5Fivemanage^7] SDK registration complete.");

    const data = await initialResponse.json();
    console.log("SDK token registered successfully", data.token);

    setInterval(async () => {
      try {
        await fetch(`${API_URL}/heartbeat`, {
          method: "POST",
          headers: {
            Authorization: data.token,
          },
        });
      } catch (error) {
        console.error("Error during SDK heartbeat:", error);
      }
    }, 30000);

    return data.token;
  } catch (error) {
    console.error("Error during SDK report:", error);
  }
}
