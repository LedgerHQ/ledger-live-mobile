/* @flow */
import invariant from "invariant";
import { BigNumber } from "bignumber.js";
import React, { useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";

import { isAccountEmpty } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAccountCapabilities } from "@ledgerhq/live-common/lib/compound/logic";
import { subAccountByCurrencyOrderedScreenSelector } from "../../../reducers/accounts";
import colors from "../../../colors";
import { ScreenName } from "../../../const";
import { TrackScreen } from "../../../analytics";
import LText from "../../../components/LText";
import FilteredSearchBar from "../../../components/FilteredSearchBar";
import AccountCard from "../../../components/AccountCard";
import KeyboardView from "../../../components/KeyboardView";
import InfoBox from "../../../components/InfoBox";

const SEARCH_KEYS = [
  "account.name",
  "account.unit.code",
  "account.token.name",
  "account.token.ticker",
];
const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: { params?: { currency: CryptoCurrency | TokenCurrency } },
};

const keyExtractor = item => item.account.id;

function LendingEnableSelectAccount({ route, navigation }: Props) {
  const currency = route?.params?.currency;
  invariant(currency, "currency required");
  let enabledTotalAmount = null;
  const accounts = useSelector(
    subAccountByCurrencyOrderedScreenSelector(route),
  );
  const filteredAccounts = accounts.filter(
    ({ account }) =>
      account.type === "TokenAccount" && !isAccountEmpty(account),
  );

  filteredAccounts.some(({ account }) => {
    const { enabledAmount, enabledAmountIsUnlimited } =
      (account.type === "TokenAccount" && getAccountCapabilities(account)) ||
      {};
    if (enabledAmountIsUnlimited) {
      enabledTotalAmount = Infinity;
      return true;
    }
    if (enabledAmount && enabledAmount.gt(0)) {
      enabledTotalAmount = BigNumber(enabledTotalAmount || 0).plus(
        enabledAmount,
      );
    }

    return false;
  });

  const formattedEnabledAmount =
    enabledTotalAmount instanceof BigNumber &&
    formatCurrencyUnit(currency.units[0], enabledTotalAmount, {
      showCode: true,
      disableRounding: false,
    });

  const renderItem = useCallback(
    ({
      item: result,
    }: {
      item: { account: AccountLike, parentAccount?: Account },
    }) => {
      const { account, parentAccount } = result;
      return (
        <View
          style={account.type === "Account" ? undefined : styles.tokenCardStyle}
        >
          <AccountCard
            account={account}
            style={styles.cardStyle}
            onPress={() => {
              navigation.push(ScreenName.LendingEnableAmount, {
                accountId: account.id,
                parentId:
                  account.type !== "Account"
                    ? account.parentId
                    : parentAccount?.id,
                currency,
              });
            }}
          />
        </View>
      );
    },
    [currency, navigation],
  );
  const renderList = useCallback(
    items => {
      return (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
        />
      );
    },
    [renderItem],
  );

  const renderEmptySearch = useCallback(
    () => (
      <View style={styles.emptyResults}>
        <LText style={styles.emptyText}>
          <Trans i18nKey="transfer.receive.noAccount" />
        </LText>
      </View>
    ),
    [],
  );
  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="LendingEnable" name="SelectAccount" />
      <KeyboardView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <FilteredSearchBar
            list={filteredAccounts}
            inputWrapperStyle={styles.padding}
            renderList={renderList}
            renderEmptySearch={renderEmptySearch}
            keys={SEARCH_KEYS}
          />
        </View>
        <View style={styles.infoSection}>
          <InfoBox
            onLearnMore={
              !enabledTotalAmount
                ? () => {
                    // @TODO redirect to suport page
                  }
                : undefined
            }
          >
            {enabledTotalAmount ? (
              <Trans
                i18nKey={
                  enabledTotalAmount < Infinity
                    ? "transfer.lending.enable.selectAccount.enabledAccountsAmount"
                    : "transfer.lending.enable.selectAccount.enabledAccountsNoLimit"
                }
                values={{
                  number: filteredAccounts.length,
                  amount: formattedEnabledAmount,
                }}
              />
            ) : (
              <Trans i18nKey="transfer.lending.enable.selectAccount.noEnabledAccounts" />
            )}
          </InfoBox>
        </View>
      </KeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  tokenCardStyle: {
    marginLeft: 26,
    paddingLeft: 7,
    borderLeftWidth: 1,
    borderLeftColor: colors.fog,
  },
  searchContainer: {
    paddingTop: 16,
    flex: 1,
  },
  list: {
    paddingBottom: 32,
  },
  emptyResults: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.fog,
  },
  padding: {
    paddingHorizontal: 16,
  },
  cardStyle: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  infoSection: { padding: 16 },
});

export default LendingEnableSelectAccount;
