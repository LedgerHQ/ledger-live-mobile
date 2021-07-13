// @flow
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { WebView } from "react-native-webview";
import { useNavigation, useTheme } from "@react-navigation/native";
import Color from "color";

import { JSONRPCRequest } from "json-rpc-2.0";

import type { SignedOperation } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  listCryptoCurrencies,
  findCryptoCurrencyById,
} from "@ledgerhq/live-common/lib/currencies/index";
import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

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
import UpdateIcon from "../../icons/Update";

import * as tracking from "./tracking";

type Props = {
  manifest: AppManifest,
};

const ReloadButton = ({
  onReload,
  loading,
}: {
  onReload: Function,
  loading: boolean,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.buttons}
      disabled={loading}
      onPress={() => !loading && onReload()}
    >
      <UpdateIcon size={18} color={colors.grey} />
    </TouchableOpacity>
  );
};

const WebPlatformPlayer = ({ manifest }: Props) => {
  const targetRef: { current: null | WebView } = useRef(null);
  const accounts = useSelector(accountsSelector);
  const currencies = useMemo(() => listCryptoCurrencies(), []);
  const theme = useTheme();

  const [loadDate, setLoadDate] = useState(Date.now());
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  const uri = useMemo(() => {
    const url = new URL(manifest.url);

    url.searchParams.set("backgroundColor", new Color(theme.colors.card).hex());
    url.searchParams.set("textColor", new Color(theme.colors.text).hex());
    url.searchParams.set("loadDate", loadDate.valueOf().toString());

    return url;
  }, [manifest.url, loadDate, theme]);

  const navigation = useNavigation();

  const listAccounts = useCallback(
    () =>
      accounts.map(account =>
        serializePlatformAccount(accountToPlatformAccount(account)),
      ),
    [accounts],
  );

  const listCurrencies = useCallback(
    // TODO: use type ListCurrenciesParams from LedgerLiveApiSdk
    () => currencies.map(currencyToPlatformCurrency),
    [currencies],
  );

  const requestAccount = useCallback(
    ({
      currencies: currencyIds = [],
      allowAddAccount,
    }: // TODO: use type RequestAccountParams from LedgerLiveApiSdk
    // }: RequestAccountParams) =>
    {
      currencies?: string[],
      allowAddAccount?: boolean,
    }) =>
      new Promise((resolve, reject) => {
        tracking.platformRequestAccountRequested(manifest);

        // handle no curencies selected case
        const cryptoCurrencies =
          currencyIds.length > 0 ? currencyIds : currencies.map(({ id }) => id);

        const foundAccounts =
          cryptoCurrencies && cryptoCurrencies.length
            ? accounts.filter(a => cryptoCurrencies.includes(a.currency.id))
            : accounts;

        // @TODO replace with correct error
        if (foundAccounts.length <= 0 && !allowAddAccount) {
          tracking.platformRequestAccountFail(manifest);
          reject(new Error("No accounts found matching request"));
          return;
        }

        // // if single account found return it
        // if (foundAccounts.length === 1 && !allowAddAccount) {
        //   resolve(
        //     serializePlatformAccount(
        //       accountToPlatformAccount(foundAccounts[0]),
        //     ),
        //   );
        //   return;
        // }

        // list of queried cryptoCurrencies with one or more accounts -> used in case of not allowAddAccount and multiple accounts selectable
        const currenciesDiff = allowAddAccount
          ? cryptoCurrencies
          : foundAccounts
              .map(a => a.currency.id)
              .filter(
                (c, i, arr) =>
                  cryptoCurrencies.includes(c) && i === arr.indexOf(c),
              );

        // if single currency available redirect to select account directly
        if (currenciesDiff.length === 1) {
          const currency = findCryptoCurrencyById(currenciesDiff[0]);
          if (!currency) {
            tracking.platformRequestAccountFail(manifest);
            // @TODO replace with correct error
            reject(new Error("Currency not found"));
            return;
          }
          navigation.navigate(NavigatorName.RequestAccount, {
            screen: ScreenName.RequestAccountsSelectAccount,
            params: {
              currencies: currenciesDiff,
              currency,
              allowAddAccount,
              onSuccess: account => {
                tracking.platformRequestAccountSuccess(manifest);
                resolve(
                  serializePlatformAccount(accountToPlatformAccount(account)),
                );
              },
              onError: error => {
                tracking.platformRequestAccountFail(manifest);
                reject(error);
              },
            },
          });
        } else {
          navigation.navigate(NavigatorName.RequestAccount, {
            screen: ScreenName.RequestAccountsSelectCrypto,
            params: {
              currencies: currenciesDiff,
              allowAddAccount,
              onSuccess: account => {
                tracking.platformRequestAccountSuccess(manifest);
                resolve(
                  serializePlatformAccount(accountToPlatformAccount(account)),
                );
              },
              onError: error => {
                tracking.platformRequestAccountFail(manifest);
                reject(error);
              },
            },
          });
        }
      }),
    [manifest, accounts, currencies, navigation],
  );

  const receiveOnAccount = useCallback(
    ({ accountId }: { accountId: string }) => {
      tracking.platformReceiveRequested(manifest);
      const account = accounts.find(account => account.id === accountId);

      return new Promise((resolve, reject) => {
        if (!account) {
          tracking.platformReceiveFail(manifest);
          reject();
          return;
        }

        navigation.navigate(ScreenName.VerifyAccount, {
          account,
          onSuccess: account => {
            tracking.platformReceiveSuccess(manifest);
            resolve(account.freshAddress);
          },
          onClose: () => {
            tracking.platformReceiveFail(manifest);
            reject(new Error("User cancelled"));
          },
          onError: e => {
            tracking.platformReceiveFail(manifest);
            // @TODO put in correct error text maybe
            reject(e);
          },
        });
      });
    },
    [manifest, accounts, navigation],
  );

  const signTransaction = useCallback(
    ({
      accountId,
      transaction,
      params = {},
    }: // TODO: use type SignTransactionParams from LedgerLiveApiSdk
    // }: SignTransactionParams) => {
    {
      accountId: string,
      transaction: RawPlatformTransaction,
      params: any,
    }) => {
      const platformTransaction = deserializePlatformTransaction(transaction);
      const account = accounts.find(account => account.id === accountId);

      return new Promise((resolve, reject) => {
        // @TODO replace with correct error
        if (!transaction) {
          tracking.platformSignTransactionFail(manifest);
          reject(new Error("Transaction required"));
          return;
        }
        if (!account) {
          tracking.platformSignTransactionFail(manifest);
          reject(new Error("Account required"));
          return;
        }

        const bridge = getAccountBridge(account);

        const t = bridge.createTransaction(account);
        const { recipient, ...txData } = platformTransaction;
        const t2 = bridge.updateTransaction(t, {
          recipient,
          feesStrategy: "custom",
        });

        const tx = bridge.updateTransaction(t2, {
          ...txData,
          userGasLimit: txData.gasLimit,
        });

        navigation.navigate(NavigatorName.SignTransaction, {
          screen: ScreenName.SignTransactionSummary,
          params: {
            currentNavigation: ScreenName.SignTransactionSummary,
            nextNavigation: ScreenName.SignTransactionSelectDevice,
            transaction: tx,
            accountId,
            appName: params.useApp,
            onSuccess: ({ signedOperation, transactionSignError }) => {
              if (transactionSignError) {
                tracking.platformSignTransactionFail(manifest);
                reject(transactionSignError);
              } else {
                tracking.platformSignTransactionSuccess(manifest);
                resolve(signedOperation);
                const n = navigation.dangerouslyGetParent() || navigation;
                n.dangerouslyGetParent().pop();
              }
            },
            onError: error => {
              tracking.platformSignTransactionFail(manifest);
              reject(error);
            },
          },
        });
      });
    },
    [manifest, accounts, navigation],
  );

  const broadcastTransaction = useCallback(
    async ({
      accountId,
      signedTransaction,
    }: {
      accountId: string,
      signedTransaction: SignedOperation,
    }) => {
      const account = accounts.find(a => a.id === accountId);

      return new Promise((resolve, reject) => {
        // @TODO replace with correct error
        if (!signedTransaction) {
          tracking.platformBroadcastFail(manifest);
          reject(new Error("Transaction required"));
          return;
        }
        if (!account) {
          tracking.platformBroadcastFail(manifest);
          reject(new Error("Account required"));
          return;
        }

        if (!getEnv("DISABLE_TRANSACTION_BROADCAST")) {
          broadcastSignedTx(account, null, signedTransaction).then(
            op => {
              tracking.platformBroadcastSuccess(manifest);
              resolve(op.hash);
            },
            error => {
              tracking.platformBroadcastFail(manifest);
              reject(error);
            },
          );
        }
      });
    },
    [manifest, accounts],
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
      targetRef?.current?.postMessage(
        JSON.stringify(request),
        typeof manifest.url === "string"
          ? manifest.url
          : manifest.url?.origin ?? "",
      );
    },
    [manifest],
  );

  const [receive] = useJSONRPCServer(handlers, handleSend);

  const handleMessage = useCallback(
    e => {
      // FIXME: event isn't the same on desktop & mobile
      // if (e.isTrusted && e.origin === manifest.url.origin && e.data) {
      if (e.nativeEvent?.data) {
        receive(JSON.parse(e.nativeEvent.data));
      }
    },
    [receive],
  );

  const handleLoad = useCallback(() => {
    if (!widgetLoaded) {
      tracking.platformLoadSuccess(manifest);
      setWidgetLoaded(true);
    }
  }, [manifest, widgetLoaded]);

  const handleReload = useCallback(() => {
    tracking.platformReload(manifest);
    setLoadDate(Date.now());
    setWidgetLoaded(false);
  }, [manifest]);

  const handleError = useCallback(() => {
    tracking.platformLoadFail(manifest);
  }, [manifest]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ReloadButton onReload={handleReload} loading={!widgetLoaded} />
      ),
    });
  }, [navigation, widgetLoaded, handleReload]);

  useEffect(() => {
    tracking.platformLoad(manifest);
  }, [manifest]);

  return (
    <SafeAreaView style={[styles.root]}>
      <WebView
        ref={targetRef}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        )}
        originWhitelist={manifest.domains}
        allowsInlineMediaPlayback
        source={{
          uri: uri.toString(),
        }}
        onLoad={handleLoad}
        onMessage={handleMessage}
        onError={handleError}
        mediaPlaybackRequiresUserAction={false}
        scalesPageToFitmediaPlaybackRequiresUserAction
        automaticallyAdjustContentInsets={false}
        scrollEnabled={true}
        style={styles.webview}
      />
    </SafeAreaView>
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
  buttons: {
    padding: 16,
  },
});

export default WebPlatformPlayer;
