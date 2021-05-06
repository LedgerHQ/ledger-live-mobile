// @flow
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

import { JSONRPCRequest } from "json-rpc-2.0";
//import { BigNumber } from "bignumber.js";

import type {
  SignedOperation,
  Transaction,
} from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useLedgerLiveApi } from "@ledgerhq/live-common/lib/platform/ledgerLiveAPI";
import { useToasts } from "@ledgerhq/live-common/lib/notifications/ToastProvider";
import { getEnv } from "@ledgerhq/live-common/lib/env";

import { accountsSelector } from "../../reducers/accounts";

import type { Manifest } from "./type";

const injectedCode = `
  window.postMessage = event => {
    window.ReactNativeWebView.postMessage(event);
  }
  true;
`;

type Props = {
  manifest: Manifest,
};

const WebPlatformPlayer = ({ manifest }: Props) => {
  const targetRef: { current: null | WebView } = useRef(null);
  const dispatch = useDispatch();
  const accounts = useSelector(accountsSelector);
  const { pushToast } = useToasts();

  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);

  const listAccounts = useCallback(() => {
    console.log("XXX - handlers - listAccounts");
    return accounts;
  }, []);

  const receiveOnAccount = useCallback(
    ({ accountId }: { accountId: string }) => {
      console.log("XXX - handlers - receiveOnAccount");
      const account = accounts.find(account => account.id === accountId);

      return new Promise(
        (resolve, reject) => {},
        /* TODO:
        dispatch(
          openModal("MODAL_EXCHANGE_CRYPTO_DEVICE", {
            account,
            parentAccount: null,
            onResult: resolve,
            onCancel: reject,
            verifyAddress: true,
          }),
        ),
        */
      );
    },
    [accounts, dispatch],
  );

  const signTransaction = useCallback(
    ({
      accountId,
      transaction,
    }: {
      accountId: string,
      transaction: Transaction,
    }) => {
      console.log("XXX - handlers - signTransaction");
      const account = accounts.find(account => account.id === accountId);

      return new Promise(
        (resolve, reject) => {},
        /* TODO:
        dispatch(
          openModal("MODAL_SIGN_TRANSACTION", {
            transactionData: {
              amount: new BigNumber(transaction.amount),
              data: transaction.data
                ? Buffer.from(transaction.data)
                : undefined,
              userGasLimit: transaction.gasLimit
                ? new BigNumber(transaction.gasLimit)
                : undefined,
              gasLimit: transaction.gasLimit
                ? new BigNumber(transaction.gasLimit)
                : undefined,
              gasPrice: transaction.gasPrice
                ? new BigNumber(transaction.gasPrice)
                : undefined,
              family: transaction.family,
              recipient: transaction.recipient,
            },
            account,
            parentAccount: null,
            onResult: resolve,
            onCancel: reject,
          }),
        ),
        */
      );
    },
    [dispatch, accounts],
  );

  const broadcastTransaction = useCallback(
    async ({
      accountId,
      signedTransaction,
    }: {
      accountId: string,
      signedTransaction: SignedOperation,
    }) => {
      console.log("XXX - handlers - broadcastTransaction");
      const account = accounts.find(account => account.id === accountId);

      const bridge = getAccountBridge(account);

      if (!getEnv("DISABLE_TRANSACTION_BROADCAST")) {
        await bridge.broadcast({
          account,
          signedTransaction,
        });
      }
      pushToast({
        id: signedTransaction.operation.id,
        type: "operation",
        title: "Transaction sent !",
        text: "Click here for more information",
        icon: "info",
        callback: () => {},
      });
      return signedTransaction.operation;
    },
    [accounts],
  );

  const handlers = useMemo(
    () => ({
      "account.list": listAccounts,
      "account.receive": receiveOnAccount,
      "transaction.sign": signTransaction,
      "transaction.broadcast": broadcastTransaction,
    }),
    [listAccounts, receiveOnAccount, signTransaction, broadcastTransaction],
  );

  const handleSend = useCallback(
    (request: JSONRPCRequest) => {
      console.log("XXX - handleSend - request:", request);
      targetRef?.current?.postMessage(
        JSON.stringify(request),
        manifest.url.origin,
      );
    },
    [manifest],
  );

  const [receive] = useLedgerLiveApi(handlers, handleSend);

  const handleMessage = useCallback(
    e => {
      // FIXME: event isn't the same on desktop & mobile
      //if (e.isTrusted && e.origin === manifest.url.origin && e.data) {
      if (e.nativeEvent?.data) {
        receive(JSON.parse(e.nativeEvent.data));
      }
    },
    [manifest, receive],
  );

  const handleLoad = useCallback(() => {
    setWidgetError(false);
    setWidgetLoaded(true);
  }, []);

  useEffect(() => {
    if (!widgetLoaded) {
      const timeout = setTimeout(() => {
        setWidgetError(true);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [widgetLoaded, widgetError]);

  return (
    <View style={[styles.root]}>
      <WebView
        ref={targetRef}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        )}
        originWhitelist={["https://*"]}
        allowsInlineMediaPlayback
        source={{
          uri: `${manifest.url.toString()}&${loadDate}`,
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
      {/* TODO: bottom bar here*/}
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
