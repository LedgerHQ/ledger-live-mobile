import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavigationProp, useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { getFTXToken, saveFTXToken } from "../../../db";

export function SwapConnectFTX({
  route,
  navigation,
}: {
  route: { params: { uri: string } },
  navigation: NavigationProp,
}) {
  const { dark } = useTheme();
  const { uri } = route.params;
  const { token, saveToken } = useFTXToken();

  const preload = useMemo(() => {
    const isKYC = new URL(uri).pathname.split("/")[1] === "kyc";

    return `
      (function() {
        window.ledger = { postMessage: window.ReactNativeWebView.postMessage };
        
        window.ledger.setToken = token => {
          const message = JSON.stringify({
            type: "setToken",
            token,
          });
          window.ledger.postMessage(message);
        }
        
        window.ledger.closeWidget = () => {
          const message = JSON.stringify({
            type: "closeWidget",
          });
          window.ledger.postMessage(message);
        }

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
            saveToken(data.token);
            break;
          case "closeWidget":
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
    [navigation, saveToken],
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

function useFTXToken() {
  const [token, setToken] = useState();

  const saveToken = useCallback((token: string) => {
    saveFTXToken(token);
  }, []);

  useEffect(() => {
    async function setup() {
      const token = await getFTXToken();
      setToken(token);
    }

    setup();
  }, []);

  return {
    token,
    saveToken,
  };
}

type Message = { type: "setToken", token: string } | { type: "closeWidget" };

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
