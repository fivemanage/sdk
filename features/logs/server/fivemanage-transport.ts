import Transport = require("winston-transport");

type FivemanageTransportOptions = {
	apiKey: string;
	batchInterval?: number;
	batchCount?: number;
	maxBatchSize?: number;
	shouldReprocessFailedBatches?: boolean;
} & Transport.TransportStreamOptions;

type LogBatch = Array<Record<string, unknown>>;

const apiUrl = "https://api.fivemanage.com/api/v3/logs";
const defaultMaxBatchSize = 100;

class FivemanageLogBatchError extends Error {
	readonly retryable: boolean;

	constructor(message: string, retryable: boolean) {
		super(message);
		this.name = "FivemanageLogBatchError";
		this.retryable = retryable;
	}
}

function getErrorMessage(error: unknown) {
	if (typeof error === "string") return error;

	if (
		error &&
		typeof error === "object" &&
		"message" in error &&
		typeof error.message === "string"
	) {
		return error.message;
	}

	return "Unknown Error";
}

async function getResponseErrorMessage(response: Awaited<ReturnType<typeof fetch>>) {
	try {
		const body = (await response.json()) as Record<string, unknown>;
		if (typeof body.error === "string") return body.error;
		if (typeof body.message === "string") return body.message;
		return JSON.stringify(body);
	} catch {
		return response.statusText || "Unknown";
	}
}

export class FivemanageTransport extends Transport {
	private readonly apiKey: string;
	private readonly batchInterval: number;
	private readonly batchCount: number;
	private readonly maxBatchSize: number;
	private readonly shouldReprocessFailedBatches: boolean;
	private readonly interval: ReturnType<typeof setInterval>;
	private datasetBatches: Record<string, LogBatch> = {};
	private flushPromise?: Promise<void>;
	private shouldFlushAgain = false;

	constructor(options: FivemanageTransportOptions) {
		super(options);

		this.apiKey = options.apiKey;
		this.batchInterval = options.batchInterval ?? 5000;
		this.batchCount = options.batchCount ?? 10;
		this.maxBatchSize = Math.max(1, options.maxBatchSize ?? defaultMaxBatchSize);
		this.shouldReprocessFailedBatches =
			options.shouldReprocessFailedBatches ?? false;
		this.interval = this.startInterval();
	}

	private startInterval() {
		return setInterval(() => {
			void this.processBatch();
		}, this.batchInterval);
	}

	async processBatch() {
		if (this.flushPromise) {
			this.shouldFlushAgain = true;
			return this.flushPromise;
		}

		this.flushPromise = this.flushPendingBatches();

		try {
			await this.flushPromise;
		} finally {
			this.flushPromise = undefined;

			if (this.shouldFlushAgain) {
				this.shouldFlushAgain = false;
				await this.processBatch();
			}
		}
	}

	private async flushPendingBatches() {
		const datasetBatches = this.datasetBatches;
		this.datasetBatches = {};

		await Promise.all(
			Object.entries(datasetBatches).map(async ([datasetId, datasetBatch]) => {
				for (let i = 0; i < datasetBatch.length; i += this.maxBatchSize) {
					await this.sendBatch(datasetId, datasetBatch.slice(i, i + this.maxBatchSize));
				}
			}),
		);
	}

	private async sendBatch(datasetId: string, datasetBatch: LogBatch) {
		if (datasetBatch.length === 0) return;

		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				body: JSON.stringify(datasetBatch),
				headers: {
					"Content-Type": "application/json",
					Authorization: this.apiKey,
					"X-Fivemanage-Dataset": datasetId,
				},
			});

			if (response.ok === false) {
				throw new FivemanageLogBatchError(
					`Status code: ${response.status}; Message: ${await getResponseErrorMessage(response)}`,
					response.status === 429 || response.status >= 500,
				);
			}
		} catch (error) {
			console.error(`Failed to process log batch -> ${getErrorMessage(error)}`);

			const retryable =
				!(error instanceof FivemanageLogBatchError) || error.retryable;

			if (this.shouldReprocessFailedBatches && retryable) {
				this.datasetBatches[datasetId] = [
					...datasetBatch,
					...(this.datasetBatches[datasetId] ?? []),
				];
			}
		}
	}

	log(info: Record<string, unknown>, next: () => void): void {
		const datasetId = typeof info.datasetId === "string" ? info.datasetId : "default";
		let datasetBatch = this.datasetBatches[datasetId];

		if (!datasetBatch) {
			datasetBatch = [];
			this.datasetBatches[datasetId] = datasetBatch;
		}

		datasetBatch.push({
			level: info.level,
			message: info.message,
			resource: info.resource,
			metadata: info.metadata,
		});

		if (datasetBatch.length >= this.batchCount) {
			void this.processBatch();
		}

		next();
	}

	close() {
		clearInterval(this.interval);
		void this.processBatch();
	}
}
