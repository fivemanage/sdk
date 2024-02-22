declare global {
	type RPCResponse<T = undefined> =
		| (T extends undefined ? { success: true } : { success: true; data: T })
		| { success: false; errorMsg: string };

	type ClientRPCCallback<T = undefined, U = undefined> = (
		data: T,
	) => RPCResponse<U>;

	type ServerRPCRequest<T = undefined> = {
		source: string | number;
		data: T;
	};

	type ServerRPCResolve<T = undefined> = (data: RPCResponse<T>) => void;

	type ServerRPCCallback<T = undefined, U = undefined> = (
		req: ServerRPCRequest<T>,
		res: ServerRPCResolve<U>,
	) => void;
}

// biome-ignore lint: expected export
export {};
