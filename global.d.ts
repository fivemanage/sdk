declare global {
	interface OxInventoryExports {
		registerHook: (
			event: string,
			callback: (data: Record<string, unknown>) => void,
		) => void;
	}

	interface CitizenExports {
		ox_inventory: OxInventoryExports;
	}

	type Enum<T extends object> = T[keyof T];

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
