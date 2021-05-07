// @flow
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

import { JSONRPCRequest } from "json-rpc-2.0";
import { BigNumber } from "bignumber.js";

import type {
  SignedOperation,
  Transaction,
} from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useLedgerLiveApi } from "@ledgerhq/live-common/lib/platform/ledgerLiveAPI";

import { NavigatorName, ScreenName } from "../../const";
import { broadcastSignedTx } from "../../logic/screenTransactionHooks";
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
  const accounts = useSelector(accountsSelector);

  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);

  const navigation = useNavigation();

  const listAccounts = useCallback(() => {
    console.log("XXX - handlers - listAccounts");
    return accounts;
  }, []);

  const receiveOnAccount = useCallback(
    ({ accountId }: { accountId: string }) => {
      console.log("XXX - handlers - receiveOnAccount");
      const account = accounts.find(account => account.id === accountId);

      return new Promise((resolve, reject) => {
        if (!account) reject();

        navigation.navigate(NavigatorName.ReceiveFunds, {
          screen: ScreenName.ReceiveConnectDevice,
          params: {
            account,
            onSuccess: resolve,
            onError: e => {
              // @TODO put in correct error text maybe
              reject(e);
            },
          },
        });
      });
    },
    [accounts, navigation],
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

      return new Promise((resolve, reject) => {
        // @TODO replace with correct error
        if (!transaction) reject(new Error("Transaction required"));
        if (!account) reject(new Error("Account required"));

        const bridge = getAccountBridge(account);

        const tx = bridge.updateTransaction(bridge.createTransaction(account), {
          amount: BigNumber(transaction.amount),
          data: transaction.data ? Buffer.from(transaction.data) : undefined,
          userGasLimit: transaction.gasLimit
            ? BigNumber(transaction.gasLimit)
            : undefined,
          gasLimit: transaction.gasLimit
            ? BigNumber(transaction.gasLimit)
            : undefined,
          gasPrice: transaction.gasPrice
            ? BigNumber(transaction.gasPrice)
            : undefined,
          family: transaction.family,
          recipient: transaction.recipient,
        });

        navigation.navigate(NavigatorName.SignTransaction, {
          screen: ScreenName.SignTransactionSummary,
          params: {
            currentNavigation: ScreenName.SignTransactionSummary,
            nextNavigation: ScreenName.SignTransactionSelectDevice,
            transaction: tx,
            accountId,
            onSuccess: ({ signedOperation, transactionSignError }) => {
              if (transactionSignError) reject(transactionSignError);
              else {
                resolve(signedOperation);
                const n = navigation.dangerouslyGetParent() || navigation;
                n.dangerouslyGetParent().pop();
              }
            },
            onError: reject,
          },
        });
      });
    },
    [accounts, navigation],
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
      const account = accounts.find(a => a.id === accountId);

      return new Promise((resolve, reject) => {
        // @TODO replace with correct error
        if (!signedTransaction) reject(new Error("Transaction required"));
        if (!account) reject(new Error("Account required"));

        if (!getEnv("DISABLE_TRANSACTION_BROADCAST")) {
          broadcastSignedTx(account, null, signedTransaction).then(
            op => resolve(op.hash),
            reject,
          );
        }
      });
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
      //console.log("XXX - handleSend - request:", JSON.stringify(request));
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
      //console.log("XXX - handleMessage - e:", e);
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
