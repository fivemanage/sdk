import { getErrorMessage } from "~/utils/common/misc";

const serverRPCTimeoutLength = 20000;
let counter = 0;

export function registerRPCListener<T = undefined, U = undefined>(
  eventName: string,
  cb: ClientRPCCallback<T, U>
): void {
  onNet(eventName, (respEventName: string, data: T) => {
    Promise.resolve(cb(data))
      .then((respData) => {
        emitNet(respEventName, respData);
      })
      .catch((error) => {
        emitNet(respEventName, {
          success: false,
          errorMsg: getErrorMessage(error),
        });
      });
  });
}

export function triggerServerRPC<T = undefined, U = undefined>(
  eventName: string,
  data?: T
): Promise<RPCResponse<U>> {
  return new Promise((res) => {
    let hasTimedOut = false;

    const timeoutId = setTimeout(() => {
      hasTimedOut = true;

      res({
        success: false,
        errorMsg: `Server RPC "${eventName}" has timed out after ${serverRPCTimeoutLength}ms`,
      });
    }, serverRPCTimeoutLength);

    const listenEventName = `${eventName}:${counter++}-${Math.floor(
      Math.random() * Number.MAX_SAFE_INTEGER
    ).toString(36)}`;

    emitNet(eventName, listenEventName, data);

    function handleServerResponse(resData: RPCResponse<U>) {
      removeEventListener(listenEventName, handleServerResponse);

      if (hasTimedOut) return;
      clearTimeout(timeoutId);

      res(resData);
    }

    onNet(listenEventName, handleServerResponse);
  });
}
