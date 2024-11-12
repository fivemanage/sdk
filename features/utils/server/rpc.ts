import { getErrorMessage } from "~/utils/common/misc";

const clientRPCTimeoutLength = 10000;
let counter = 0;

export function registerRPCListener<T = undefined, U = undefined>(
  eventName: string,
  cb: ServerRPCCallback<T, U>
): void {
  onNet(eventName, (respEventName: string, data: T) => {
    const playerSrc = globalThis.source;

    const req: ServerRPCRequest<T> = {
      source: playerSrc,
      data,
    };

    const res: ServerRPCResolve<U> = (resData) => {
      emitNet(respEventName, playerSrc, resData);
    };

    Promise.resolve(cb(req, res)).catch((error) => {
      res({ success: false, errorMsg: getErrorMessage(error) });
    });
  });
}

export function triggerClientRPC<T = undefined, U = undefined>(
  eventName: string,
  playerSrc: string | number,
  data?: T
): Promise<RPCResponse<U>> {
  return new Promise((res) => {
    let hasTimedOut = false;

    const timeoutId = setTimeout(() => {
      hasTimedOut = true;

      res({
        success: false,
        errorMsg: `Client RPC "${eventName}" has timed out after ${clientRPCTimeoutLength}ms`,
      });
    }, clientRPCTimeoutLength);

    const listenEventName = `${eventName}:${counter++}-${Math.floor(
      Math.random() * Number.MAX_SAFE_INTEGER
    ).toString(36)}`;

    emitNet(eventName, playerSrc, listenEventName, data);

    function handleClientResponse(resData: RPCResponse<U>) {
      removeEventListener(listenEventName, handleClientResponse);

      if (hasTimedOut) return;
      clearTimeout(timeoutId);

      res(resData);
    }

    onNet(listenEventName, handleClientResponse);
  });
}
