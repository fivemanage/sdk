// WIP

import { config } from "~/utils/common/config";

if (config.logs.baseEvents) {
  onNet(
    "baseevents:onPlayerDied",
    (killerType: number, deathCoords: string[]) => {
      console.log("baseevents:onPlayerDied");
      console.log(killerType, deathCoords);
    }
  );

  on("baseevents:onPlayerKilled", (killerId: number, deathData: any) => {
    console.log("baseevents:onPlayerKilled");
    console.log(killerId, deathData);
  });

  on("baseevents:onPlayerWasted", (deathCoords: any) => {
    console.log("baseevents:onPlayerWasted");
    console.log(deathCoords);
  });
}
