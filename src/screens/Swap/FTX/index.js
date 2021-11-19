import React, { useCallback, useMemo } from "react";
import { NavigationProp, useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import Config from "react-native-config";
import { WebView } from "react-native-webview";

export function SwapConnectFTX({
  route,
  navigation,
}: {
  route: { params: { uri: string } },
  navigation: NavigationProp,
}) {
  const { dark } = useTheme();
  const { uri } = route.params;

  // TODO: Fetch token from local store
  const token = useMemo(() => Config.FTX_TOKEN, []);
  const preload = useMemo(() => {
    const isKYC = new URL(uri).pathname.split("/")[1] === "kyc";
    return `
      (function() {
        window.ledger = { postMessage: window.ReactNativeWebView.postMessage }
        ${isKYC && `localStorage.setItem("authToken", "${token}");`}
        localStorage.setItem("theme", "${dark ? "dark" : "light"}");
      })();
    `;
  }, [uri, token, dark]);

  const handleError = useCallback(e => {
    // TODO: tracking
    console.error(e);
  }, []);

  const handleMessage = useCallback(
    ({ nativeEvent: { data: dataStr } }) => {
      try {
        const data: Message = JSON.parse(dataStr);
        switch (data.type) {
          case "setToken":
            // TODO: save token locally (data.token)
            break;
          case "closeWidet":
            // TODO: close WebView
            navigation.pop();
            break;
          default:
            break;
        }
      } catch (e) {
        // TODO: tracking
        console.error(e);
      }
    },
    [navigation],
  );

  return (
    <WebView
      style={styles.root}
      source={{ uri: route.params.uri }}
      injectedJavaScriptBeforeContentLoaded={preload}
      onError={handleError}
      onMessage={handleMessage}
    />
  );
}

type Message = { type: "setToken", token: string } | { type: "closeWidet" };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
