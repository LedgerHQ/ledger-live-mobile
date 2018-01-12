//@flow
import HttpTransport from "@ledgerhq/hw-transport-http";

const DEBUG_COMM_HTTP_PROXY = "http://192.168.0.27:8435/";
//const DEBUG_COMM_HTTP_PROXY = null;

export default class DebugHttpTransport extends HttpTransport {
  static list = (): * =>
    Promise.resolve(DEBUG_COMM_HTTP_PROXY ? [DEBUG_COMM_HTTP_PROXY] : []);
  static discover = (observer: *) => {
    if (DEBUG_COMM_HTTP_PROXY) observer.next(DEBUG_COMM_HTTP_PROXY);
    return { unsubscribe: () => {} };
  };
}
