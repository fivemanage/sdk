export async function delay(ms: number): Promise<void> {
	return new Promise((res) => setTimeout(res, ms));
}

export async function setImmediateInterval(cb: () => void, ms: number) {
	cb();
	return setInterval(cb, ms);
}

export function getErrorMessage(error: unknown) {
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
