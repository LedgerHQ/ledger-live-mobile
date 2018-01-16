//@flow
import HttpTransport from "@ledgerhq/hw-transport-http";
import Config from "react-native-config";

const DEBUG_COMM_HTTP_PROXY = Config.DEBUG_COMM_HTTP_PROXY;

export default class DebugHttpTransport extends HttpTransport {
  static list = (): * =>
    DEBUG_COMM_HTTP_PROXY
      ? DebugHttpTransport.open(DEBUG_COMM_HTTP_PROXY).then(
          () => [DEBUG_COMM_HTTP_PROXY],
          () => []
        )
      : Promise.resolve([]);

  static discover = (observer: *) => {
    let unsubscribed = false;
    if (DEBUG_COMM_HTTP_PROXY) {
      function attemptToConnect() {
        if (unsubscribed) return;
        DebugHttpTransport.open(DEBUG_COMM_HTTP_PROXY, 5000).then(
          () => {
            if (unsubscribed) return;
            observer.next(DEBUG_COMM_HTTP_PROXY);
            observer.complete();
          },
          e => {
            if (unsubscribed) return;
            console.log(
              "can't access " + DEBUG_COMM_HTTP_PROXY + " Retrying...",
              e
            );
            setTimeout(attemptToConnect, 1000);
          }
        );
      }
      attemptToConnect();
    } else {
      observer.complete();
    }
    return {
      unsubscribe: () => {
        unsubscribed = true;
      }
    };
  };
}
