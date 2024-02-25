export const LogColor: Record<string, string> = {
	error: "^8",
	warn: "^6",
	info: "^9",
	debug: "^4",
};

export type LogMetadata = {
	playerSource?: string | number;
	targetSource?: string | number;
	[key: string]: unknown;
};

export type Log = {
	level: string;
	message: string;
	resource: string;
	metadata: LogMetadata;
};
