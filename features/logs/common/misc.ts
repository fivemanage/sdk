export const LogLevel = {
	Error: "error",
	Warn: "warn",
	Info: "info",
	Debug: "debug",
} as const;

export type LogLevels = Enum<typeof LogLevel>;

export const LogColor: Record<LogLevels, string> = {
	error: "^8",
	warn: "^6",
	info: "^9",
	debug: "^4",
};

export type LogMetadata = {
	playerSource?: string | number;
	[key: string]: unknown;
};

export type Log = {
	level: LogLevels;
	message: string;
	resource: string;
	metadata: LogMetadata;
};
