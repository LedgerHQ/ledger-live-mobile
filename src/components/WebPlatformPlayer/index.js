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

import type { SignedOperation } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { listCryptoCurrencies } from "@ledgerhq/live-common/lib/currencies/index";

import type { RawPlatformTransaction } from "@ledgerhq/live-common/lib/platform/rawTypes";
import { useJSONRPCServer } from "@ledgerhq/live-common/lib/platform/JSONRPCServer";
import {
  accountToPlatformAccount,
  currencyToPlatformCurrency,
} from "@ledgerhq/live-common/lib/platform/converters";
import {
  serializePlatformAccount,
  deserializePlatformTransaction,
} from "@ledgerhq/live-common/lib/platform/serializers";

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
  const currencies = useMemo(() => listCryptoCurrencies(), []);

  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);
  const [widgetError, setWidgetError] = useState(false);

  const navigation = useNavigation();

  const listAccounts = useCallback(() => {
    console.log("XXX - handlers - listAccounts");
    return accounts.map(account =>
      serializePlatformAccount(accountToPlatformAccount(account)),
    );
  }, [accounts]);

  const listCurrencies = useCallback(() => {
    console.log("XXX - handlers - listCurrencies");
    return currencies.map(currencyToPlatformCurrency);
  }, [currencies]);

  const requestAccount = useCallback(
    ({
      currencies,
      allowAddAccount,
    }: {
      currencies?: string[],
      allowAddAccount?: boolean,
    }) => {
      return new Promise(
        (resolve, reject) => {
          /* TODO: */
        },
        /*
        dispatch(
          openModal("MODAL_REQUEST_ACCOUNT", {
            currencies,
            allowAddAccount,
            onResult: resolve,
            onCancel: reject,
          }),
        ),
        */
      );
    },
    [],
  );

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
      transaction: RawPlatformTransaction,
    }) => {
      console.log("XXX - handlers - signTransaction:", transaction);
      const platformTransaction = deserializePlatformTransaction(transaction);
      const account = accounts.find(account => account.id === accountId);

      return new Promise((resolve, reject) => {
        // @TODO replace with correct error
        if (!transaction) reject(new Error("Transaction required"));
        if (!account) reject(new Error("Account required"));

        const bridge = getAccountBridge(account);

        const tx = bridge.updateTransaction(bridge.createTransaction(account), {
          amount: platformTransaction.amount,
          data: platformTransaction.data,
          userGasLimit: platformTransaction.gasLimit,
          gasLimit: platformTransaction.gasLimit,
          gasPrice: platformTransaction.gasPrice,
          family: platformTransaction.family,
          recipient: platformTransaction.recipient,
          feesStrategy: "custom",
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
      "currency.list": listCurrencies,
      "account.request": requestAccount,
      "account.receive": receiveOnAccount,
      "transaction.sign": signTransaction,
      "transaction.broadcast": broadcastTransaction,
    }),
    [
      listAccounts,
      listCurrencies,
      requestAccount,
      receiveOnAccount,
      signTransaction,
      broadcastTransaction,
    ],
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

  const [receive] = useJSONRPCServer(handlers, handleSend);

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
