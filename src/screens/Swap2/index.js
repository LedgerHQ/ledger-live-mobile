// @flow

import { useTheme } from "@react-navigation/native";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import type {
  CryptoCurrency,
  TokenCurrency,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type {
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types/account";

import type {
  Exchange,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/exchange/swap/types";
import {
  CurrenciesStatus,
  getSupportedCurrencies,
} from "@ledgerhq/live-common/lib/exchange/swap/logic";

import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { useDebounce } from "@ledgerhq/live-common/lib/hooks/useDebounce";

import { Trans } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import {
  accountWithMandatoryTokens,
  flattenAccounts,
  getAccountCurrency,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import { useCurrenciesByMarketcap } from "@ledgerhq/live-common/lib/currencies";
import { getExchangeRates } from "@ledgerhq/live-common/lib/exchange/swap";
import Config from "react-native-config";
import AccountAmountRow from "./FormSelection/AccountAmountRow";
import Button from "../../components/Button";
import LText from "../../components/LText";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import Switch from "../../components/Switch";
import { accountsSelector } from "../../reducers/accounts";
import { swapKYCSelector } from "../../reducers/settings";

import { NavigatorName } from "../../const";
import KeyboardView from "../../components/KeyboardView";
import GenericErrorBottomModal from "../../components/GenericErrorBottomModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import Info from "../../icons/Info";
import RatesSection from "./FormSelection/RatesSection";

export type SwapRouteParams = {
  exchange: Exchange,
  exchangeRate: ExchangeRate,
  currenciesStatus: CurrenciesStatus,
  selectableCurrencies: (CryptoCurrency | TokenCurrency)[],
  transaction?: Transaction,
  status?: TransactionStatus,
  selectedCurrency: CryptoCurrency | TokenCurrency,
  providers: any,
  provider: any,
  installedApps: any,
  target: "from" | "to",
  rateExpiration?: Date,
  rate?: ExchangeRate,
  rates?: ExchangeRate[],
  tradeMethod?: string,
};

type Props = {
  route: { params: SwapRouteParams },
  navigation: *,
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
  providers: any,
  provider: any,
};

export default function SwapForm({
  route,
  navigation,
  defaultAccount: initDefaultAccount,
  providers,
  provider,
}: Props) {
  const { colors } = useTheme();

  const accounts = useSelector(accountsSelector);

  const swapKYC = useSelector(swapKYCSelector);
  const providerKYC = swapKYC[provider];

  const [error, setError] = useState(null);
  const [rates, setRates] = useState([]);
  const [rate, setRate] = useState(null);
  const [rateExpiration, setRateExpiration] = useState(null);
  const [fetchingRate, setFetchingRate] = useState(false);

  const enhancedAccounts = useMemo(
    () => accounts.map(acc => accountWithMandatoryTokens(acc, [])),
    [accounts],
  );

  const allAccounts = flattenAccounts(enhancedAccounts);

  const elligibleAccountsForSelectedCurrency = allAccounts.filter(account =>
    account.balance.gt(0),
  );

  const defaultAccount =
    initDefaultAccount || elligibleAccountsForSelectedCurrency[0];

  const [noAssetModalOpen, setNoAssetModalOpen] = useState(!defaultAccount);

  const defaultParentAccount =
    defaultAccount?.type === "TokenAccount"
      ? accounts.find(a => a.id === defaultAccount.parentId)
      : null;

  const selectableCurrencies = getSupportedCurrencies({ providers, provider });

  const maybeFilteredCurrencies = defaultAccount?.balance.gt(0)
    ? selectableCurrencies.filter(c => c !== getAccountCurrency(defaultAccount))
    : selectableCurrencies;

  const sortedCryptoCurrencies = useCurrenciesByMarketcap(
    maybeFilteredCurrencies,
  );

  const exchange: Exchange = useMemo(() => {
    const exch = route.params?.exchange
      ? {
          ...route.params.exchange,
          toCurrency: route.params.exchange?.toCurrency
            ? route.params.exchange.toCurrency
            : route.params.exchange.fromAccount
            ? sortedCryptoCurrencies.find(
                c =>
                  c !== getAccountCurrency(route.params.exchange.fromAccount),
              )
            : sortedCryptoCurrencies[0],
        }
      : {
          fromAccount: defaultAccount?.balance.gt(0)
            ? defaultAccount
            : undefined,
          fromParentAccount: defaultAccount?.balance.gt(0)
            ? defaultParentAccount
            : undefined,
          toCurrency: sortedCryptoCurrencies[0],
          toAccount: undefined,
        };

    if (exch.toCurrency) {
      const currentToCurrency = exch.toAccount
        ? getAccountCurrency(exch.toAccount)
        : null;
      if (currentToCurrency !== exch.toCurrency)
        exch.toAccount = allAccounts.find(
          a => exch.toCurrency === getAccountCurrency(a),
        );
    }

    return exch;
  }, [
    allAccounts,
    defaultAccount,
    defaultParentAccount,
    route.params?.exchange,
    sortedCryptoCurrencies,
  ]);

  const [maxSpendable, setMaxSpendable] = useState();

  const { fromAccount, fromParentAccount, toAccount } = exchange;
  // const fromCurrency = fromAccount ? getAccountCurrency(fromAccount) : null;
  // const toCurrency = toAccount ? getAccountCurrency(toAccount) : null;

  const bridge = fromAccount
    ? getAccountBridge(fromAccount, fromParentAccount)
    : null;

  const {
    status,
    transaction,
    setTransaction,
    bridgePending,
  } = useBridgeTransaction(() => ({
    ...(route.params?.transaction ?? {}),
    account: fromAccount,
    parentAccount: fromParentAccount,
  }));

  const debouncedTransaction = useDebounce(transaction, 500);

  const toggleUseAllAmount = useCallback(() => {
    if (bridge)
      setTransaction(
        bridge.updateTransaction(
          transaction || bridge.createTransaction(fromAccount),
          {
            amount: maxSpendable || BigNumber(0),
            useAllAmount: !transaction?.useAllAmount,
          },
        ),
      );
  }, [setTransaction, bridge, transaction, fromAccount, maxSpendable]);

  const resetError = useCallback(() => {
    setError();
    if (bridge)
      setTransaction(
        bridge.updateTransaction(
          transaction || bridge.createTransaction(fromAccount),
          {
            amount: BigNumber(0),
            useAllAmount: !transaction?.useAllAmount,
          },
        ),
      );
  }, [bridge, fromAccount, setTransaction, transaction]);

  const fromUnit = useMemo(() => fromAccount && getAccountUnit(fromAccount), [
    fromAccount,
  ]);

  const onNavigateToBuyCrypto = useCallback(() => {
    setNoAssetModalOpen(false);
    navigation.replace(NavigatorName.ExchangeBuyFlow);
  }, [navigation]);

  const onNavigateBack = useCallback(() => {
    setNoAssetModalOpen(false);
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    if (route.params?.rate) {
      setRate(route.params.rate);
      setRateExpiration(new Date(Date.now() + 60000));
    }
  }, [route.params?.rate]);

  useEffect(() => {
    const expirationInterval = setInterval(() => {
      if (rate && rateExpiration && rateExpiration <= new Date()) {
        setRateExpiration(null);
        setRate(null);
        clearInterval(expirationInterval);
      }
    }, 1000);

    return () => clearInterval(expirationInterval);
  }, [rate, rateExpiration]);

  useEffect(() => {
    const KYCUserId = Config.SWAP_OVERRIDE_KYC_USER_ID || providerKYC?.id;
    async function getRates() {
      setFetchingRate(true);
      try {
        // $FlowFixMe No idea how to pass this
        const rates = await getExchangeRates(
          {
            ...exchange,
            toAccount:
              exchange.toAccount || exchange.toCurrency
                ? {
                    type: "Account",
                    currency: exchange.toCurrency,
                    unit: exchange.toCurrency.units[0],
                  }
                : {},
          },
          transaction,
          KYCUserId,
        );

        setRates(rates);

        const rate = rates
          .filter(rate => rate.provider === provider)
          .sort((a, b) => a.rate > b.rate)
          .find(Boolean);

        if (rate?.error) {
          setError(rate.error);
        } else {
          setRate(rate); // FIXME when we have multiple providers this will not be enough
          setError();
          setRateExpiration(new Date(Date.now() + 60000));
        }
      } catch (error) {
        setError(error);
      } finally {
        setFetchingRate(false);
      }
    }
    if (!error && transaction?.amount.gt(0) && !rate) {
      getRates();
    } else if (transaction?.amount.lte(0)) {
      setRate(null);
      setError();
    }
  }, [
    exchange,
    fromAccount,
    toAccount,
    transaction,
    providerKYC?.id,
    provider,
    rate,
    error,
  ]);

  useEffect(() => {
    if (!fromAccount) return;

    let cancelled = false;
    getAccountBridge(fromAccount, fromParentAccount)
      .estimateMaxSpendable({
        account: fromAccount,
        parentAccount: fromParentAccount,
        transaction: debouncedTransaction,
      })
      .then(estimate => {
        if (cancelled) return;

        setMaxSpendable(estimate);
      });

    // eslint-disable-next-line consistent-return
    return () => {
      cancelled = true;
    };
  }, [fromAccount, fromParentAccount, debouncedTransaction]);

  useEffect(() => {
    if (route.params?.transaction) {
      setTransaction(route.params.transaction);
    }
  }, [route.params, setTransaction]);

  useEffect(() => {
    setRate(null);
  }, [debouncedTransaction, route.params]);

  return (
    <KeyboardView style={[styles.root, { backgroundColor: colors.background }]}>
      <View>
        <AccountAmountRow
          navigation={navigation}
          exchange={exchange}
          transaction={transaction}
          onUpdateTransaction={setTransaction}
          status={status}
          bridgePending={bridgePending}
          provider={provider}
          providers={providers}
          useAllAmount={transaction?.useAllAmount}
          fetchingRate={fetchingRate}
          rate={rate}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollZone}>
        <RatesSection
          navigation={navigation}
          transaction={transaction}
          status={status}
          rates={rates}
          rate={rate}
          provider={provider}
          exchange={exchange}
        />
        {error && (
          <GenericErrorBottomModal
            error={error}
            isOpened
            onClose={resetError}
          />
        )}
        {noAssetModalOpen && (
          <ConfirmationModal
            isOpened={noAssetModalOpen}
            onClose={onNavigateBack}
            confirmationTitle={
              <Trans i18nKey="transfer.swap.form.noAsset.title" />
            }
            confirmationDesc={
              <Trans i18nKey="transfer.swap.form.noAsset.desc" />
            }
            confirmButtonText={
              <Trans i18nKey="carousel.banners.buyCrypto.title" />
            }
            onConfirm={onNavigateToBuyCrypto}
            Icon={Info}
            iconColor={colors.orange}
            hideRejectButton
          />
        )}
      </ScrollView>
      <View>
        <View style={styles.available}>
          <View style={styles.availableLeft}>
            <LText>
              <Trans i18nKey="transfer.swap.form.amount.available" />
            </LText>
            <LText semiBold>
              {maxSpendable ? (
                <CurrencyUnitValue
                  showCode
                  unit={fromUnit}
                  value={maxSpendable}
                />
              ) : (
                "-"
              )}
            </LText>
          </View>
          {maxSpendable ? (
            <View style={styles.availableRight}>
              <LText style={styles.maxLabel}>
                <Trans i18nKey="transfer.swap.form.amount.useMax" />
              </LText>
              <Switch
                style={styles.switch}
                value={transaction?.useAllAmount}
                onValueChange={toggleUseAllAmount}
              />
            </View>
          ) : null}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            containerStyle={styles.button}
            event="ExchangeStartBuyFlow"
            type="primary"
            disabled={!!bridgePending || !!error || !rate}
            title={<Trans i18nKey="transfer.swap.form.tab" />}
            onPress={() => {
              /** move to swap summary */
            }}
          />
        </View>
      </View>
    </KeyboardView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  scrollZone: {
    flex: 1,
  },
  button: {
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 24,
    flexDirection: "row",
  },
  available: {
    flexDirection: "row",
    display: "flex",
    flexGrow: 1,
  },
  availableRight: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  availableLeft: {
    justifyContent: "center",
    flexGrow: 1,
  },
  maxLabel: {
    marginRight: 4,
  },
  switch: {
    opacity: 0.99,
  },
  valueLabel: { marginLeft: 4, fontSize: 14, lineHeight: 20 },
  label: {
    fontSize: 16,
    lineHeight: 19,
  },
  addAccountsection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 4,
    padding: 12,
    marginVertical: 10,
  },
  spacer: { flex: 0.5, flexShrink: 1, flexGrow: 1 },
  addAccountLabel: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  addAccountButton: { height: 40 },
  addAccountButtonLabel: { fontSize: 12 },
});
