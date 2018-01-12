//@flow
import HttpTransport from "@ledgerhq/hw-transport-http";
import Config from "react-native-config";

const DEBUG_COMM_HTTP_PROXY = Config.DEBUG_COMM_HTTP_PROXY;
//const DEBUG_COMM_HTTP_PROXY = null;

export default class DebugHttpTransport extends HttpTransport {
  static list = (): * =>
    Promise.resolve(DEBUG_COMM_HTTP_PROXY ? [DEBUG_COMM_HTTP_PROXY] : []);
  static discover = (observer: *) => {
    if (DEBUG_COMM_HTTP_PROXY) observer.next(DEBUG_COMM_HTTP_PROXY);
    return { unsubscribe: () => {} };
  };
}
