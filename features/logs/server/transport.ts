import Transport from "winston-transport";
import type { Log } from "~/logs/common/misc";
import { getErrorMessage, setImmediateInterval } from "~/utils/common/misc";
import { convars } from "~/utils/server/convars";

export class FivemanageTransport extends Transport {
	private readonly apiUrl = "https://api.fivemanage.com/api/logs/batch";
	private batch: Array<Log> = [];
	private readonly batchInterval = 5000;
	private readonly batchCount = 10;

	constructor(opts?: Transport.TransportStreamOptions) {
		super(opts);

		this.startInterval();
	}

	startInterval() {
		setImmediateInterval(async () => {
			await this.processBatch();
		}, this.batchInterval);
	}

	async processBatch() {
		if (this.batch.length === 0) return;

		const batch = this.batch;
		this.batch = [];

		try {
			const res = await fetch(this.apiUrl, {
				method: "POST",
				body: JSON.stringify(batch),
				headers: {
					"Content-Type": "application/json",
					Authorization: convars.FIVEMANAGE_LOGS_API_KEY,
				},
			});

			if (res.ok === false) {
				throw new Error("Failed to upload logs to Fivemanage");
			}
		} catch (error) {
			console.error(`Failed to process log batch: ${getErrorMessage(error)}`);

			// re-add the batch to be processed again
			this.batch.concat(batch);
		}
	}

	log(info: Log, next: () => void): void {
		this.batch.push({
			level: info.level,
			message: info.message,
			resource: info.resource,
			metadata: info.metadata,
		});

		if (this.batch.length >= this.batchCount) {
			this.processBatch();
		}

		next();
	}
}
