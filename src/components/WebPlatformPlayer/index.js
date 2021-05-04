// @flow
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { getPlatformUrl } from "./config";
import useLedgerLiveApi from "./api";

const injectedCode = `
  var originalWinPostMessage = window.postMessage;
  window.postMessage = event => {
    window.ReactNativeWebView.postMessage(JSON.stringify(event));
  }
  window.addEventListener("message", event => {
    originalWinPostMessage(JSON.parse(event.nativeEvent.data), "*");
  });

  var originalDocPostMessage = document.postMessage;
  document.postMessage = event => {
    document.ReactNativeWebView.postMessage(JSON.stringify(event));
  }
  document.addEventListener("message", event => {
    originalDocPostMessage(JSON.parse(event.nativeEvent.data), "*");
  });

  true;
`;

type Props = {
  provider: string,
};

const WebPlatformPlayer = ({ provider }: Props) => {
  const { targetRef, handleMessage } = useLedgerLiveApi(provider);
  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);

  const handleLoad = useCallback(() => {
    setWidgetError(false);
    setWidgetLoaded(true);
  }, []);

  const handleReload = useCallback(() => {
    setLoadDate(Date.now());
    setWidgetError(false);
    setWidgetLoaded(false);
  }, []);

  useEffect(() => {
    if (!widgetLoaded) {
      const timeout = setTimeout(() => {
        setWidgetError(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [widgetLoaded, widgetError]);

  const url = getPlatformUrl(provider, loadDate);
  //console.log("XXX - url: ", url);

  return !url ? (
    <Text>{"Oops no provider: " + provider}</Text>
  ) : (
    <View style={[styles.root]}>
      <WebView
        // $FlowFixMe
        ref={targetRef}
        startInLoadingState={true}
        renderLoading={() =>
          !widgetLoaded ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" />
            </View>
          ) : null
        }
        originWhitelist={["https://*"]}
        allowsInlineMediaPlayback
        source={{
          uri: `${url}?${loadDate}`,
        }}
        onLoad={handleLoad}
        injectedJavaScript={injectedCode}
        onMessage={handleMessage}
        mediaPlaybackRequiresUserAction={false}
        scalesPageToFitmediaPlaybackRequiresUserAction
        automaticallyAdjustContentInsets={false}
        scrollEnabled={true}
        style={styles.webview}
        androidHardwareAccelerationDisabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
  },
  modalContainer: {
    flexDirection: "row",
  },
  webview: {
    flex: 0,
    width: "100%",
    height: "100%",
  },
});

export default WebPlatformPlayer;
