import { LRUCache } from "lru-cache";
import { config } from "~/utils/common/config";

export type IdentifierType =
  | "discord"
  | "fivem"
  | "ip"
  | "license"
  | "license2"
  | "live"
  | "steam"
  | "xbl";

export type FormattedPlayerIdentifiers = {
  [T in IdentifierType]?: string;
};

const identifierCache = new LRUCache<string, FormattedPlayerIdentifiers>({
  max: 500,
});

export function getFormattedPlayerIdentifiers(
  playerSrc: string | number
): FormattedPlayerIdentifiers {
  let source = playerSrc;

  if (typeof source === "number") {
    source = source.toString();
  }

  if (identifierCache.has(source)) {
    return identifierCache.get(source) as FormattedPlayerIdentifiers;
  }

  const identifiers: FormattedPlayerIdentifiers = {};

  for (const identifier of getPlayerIdentifiers(source)) {
    const splitId = identifier.split(":");

    if (!splitId[0] || !splitId[1]) continue;
    if (config.logs.excludedPlayerIdentifiers.includes(splitId[0])) continue;

    identifiers[splitId[0] as IdentifierType] = splitId[1];
  }

  identifierCache.set(source, identifiers);

  return identifiers;
}

export function getPlayerIdentifierByType(
  playerSrc: string | number,
  identifierType: IdentifierType
): string {
  return GetPlayerIdentifierByType(
    typeof playerSrc === "string" ? playerSrc : playerSrc.toString(),
    identifierType
  );
}
