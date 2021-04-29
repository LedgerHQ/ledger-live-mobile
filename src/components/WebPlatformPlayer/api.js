// @flow
import { useEffect, useRef, useCallback } from "react";
import { useStore, useDispatch } from "react-redux";
import { WebView } from "react-native-webview";
import { JSONRPCServer } from "json-rpc-2.0";

import { getPlatformOrigin } from "./config";

import handlers from "./handlers";

const useLedgerLiveApi = (platform: string) => {
  const targetRef: { current: null | WebView } = useRef(null);
  const dispatch = useDispatch();
  const store = useStore();
  const server: { current: null | JSONRPCServer } = useRef(null);

  const origin = getPlatformOrigin(platform);

  const handleMessage = useCallback(
    event => {
      // FIXME: event isn't the same on desktop & mobile
      //if (!event.isTrusted || event.origin !== origin || !event.data) return;
      if (!event.nativeEvent.data) return;

      // prettier-ignore
      console.log("XXX - event.nativeEvent.data: ", JSON.parse(event.nativeEvent.data));

      if (server.current) {
        server.current
          .receiveJSON(JSON.parse(event.nativeEvent.data))
          .then(jsonRPCResponse => {
            //console.log("XXX - jsonRPCResponse: ", JSON.stringify(jsonRPCResponse));
            if (jsonRPCResponse && origin) {
              targetRef.current?.postMessage(
                JSON.stringify(jsonRPCResponse),
                origin,
              );
            }
          });
      }
    },
    [origin],
  );

  const connectHandler = useCallback(
    handlerFunction => params =>
      handlerFunction(store.getState(), dispatch, params),
    [store, dispatch],
  );

  useEffect(() => {
    server.current = new JSONRPCServer();

    for (const method in handlers) {
      server.current?.addMethod(method, connectHandler(handlers[method]));
    }

    return () => {
      server.current = null;
    };
  }, [connectHandler]);

  return { targetRef, handleMessage };
};

export default useLedgerLiveApi;
