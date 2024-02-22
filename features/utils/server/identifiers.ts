import { LRUCache } from "lru-cache";

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
	playerSrc: string,
): FormattedPlayerIdentifiers {
	if (identifierCache.has(playerSrc)) {
		return identifierCache.get(playerSrc) as FormattedPlayerIdentifiers;
	}

	const identifiers: FormattedPlayerIdentifiers = {};

	for (const identifier of getPlayerIdentifiers(playerSrc)) {
		const splitId = identifier.split(":");

		if (splitId[0] && splitId[1]) {
			identifiers[splitId[0] as IdentifierType] = splitId[1];
		}
	}

	identifierCache.set(playerSrc, identifiers);

	return identifiers;
}

export function getPlayerIdentifierByType(
	playerSrc: string,
	identifierType: IdentifierType,
): string {
	return GetPlayerIdentifierByType(playerSrc, identifierType);
}
