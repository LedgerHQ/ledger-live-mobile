/* @flow */
import { BigNumber } from "bignumber.js";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";

import type {
  Account,
  AccountLikeArray,
} from "@ledgerhq/live-common/lib/types";
import {
  accountWithMandatoryTokens,
  flattenAccounts,
} from "@ledgerhq/live-common/lib/account/helpers";

import type { SearchResult } from "../../../helpers/formatAccountSearchResults";
import { accountsSelector } from "../../../reducers/accounts";
import { TrackScreen } from "../../../analytics";
import LText from "../../../components/LText";
import FilteredSearchBar from "../../../components/FilteredSearchBar";
import AccountCard from "../../../components/AccountCard";
import KeyboardView from "../../../components/KeyboardView";
import { formatSearchResults } from "../../../helpers/formatAccountSearchResults";
import { NavigatorName, ScreenName } from "../../../const";

import type { SwapRouteParams } from "..";
import AddIcon from "../../../icons/Plus";

const SEARCH_KEYS = ["name", "unit.code", "token.name", "token.ticker"];
import { useFeesStrategy } from "@ledgerhq/live-common/lib/families/ethereum/react";
import SelectFeesStrategy from "./SelectFeesStrategy";

type Props = {
  accounts: Account[],
  allAccounts: AccountLikeArray,
  navigation: any,
  route: { params: SwapRouteParams },
};

export default function SelectFees({ navigation, route }: Props) {
  console.log("route.params.transaction", route.params.transaction);
  const { colors } = useTheme();
  const {
    setTransaction,
    setTransactionScreenFeeRef,
    account,
    parentAccount,
  } = route.params;

  const [transaction, setLocalTransaction] = useState(route.params.transaction);
  useEffect(() => {
    setTransactionScreenFeeRef.current = setLocalTransaction;
    return () => {
      setTransactionScreenFeeRef.current = null;
    };
  }, [setTransactionScreenFeeRef]);

  transaction.networkInfo.gasPrice = {
    min: new BigNumber(10),
    initial: new BigNumber(20),
    max: new BigNumber(42),
  };
  // useEffect(() => {
  //   const bridge = getAccountBridge(account, parentAccount);
  //
  //   setTransaction(
  //     bridge.updateTransaction(transaction, {
  //       networkInfo: {
  //         gasPrice: {
  //           min: new BigNumber(1),
  //           initial: new BigNumber(2),
  //           max: new BigNumber(4242),
  //         },
  //       },
  //     }),
  //   );
  //   console.log("useEffect", transaction);
  // }, []);

  const defaultStrategies = useFeesStrategy(transaction);

  console.log("defaultStrategies", defaultStrategies);
  // const { exchange, target, selectedCurrency } = route.params;
  // const accounts = useSelector(accountsSelector);

  const onPressStrategySelect = ({ label }) => {
    const bridge = getAccountBridge(account, parentAccount);

    setTransaction(
      bridge.updateTransaction(transaction, {
        feesStrategy: label,
      }),
    );
    console.log("onPressStrategySelect", transaction);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <TrackScreen category="ReceiveFunds" name="SelectAccount" />
      <KeyboardView style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <SelectFeesStrategy
            strategies={defaultStrategies}
            account={account}
            parentAccount={parentAccount}
            transaction={transaction}
            onStrategySelect={onPressStrategySelect}
            onCustomFeesPress={test => console.log("onCustomFeesPress", test)}
          />
        </View>
      </KeyboardView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addAccountButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 16,
    alignItems: "center",
  },
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tokenCardStyle: {
    marginLeft: 26,
    paddingLeft: 7,
    borderLeftWidth: 1,
  },
  card: {
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  searchContainer: {
    paddingTop: 18,
    flex: 1,
  },
  list: {
    paddingTop: 8,
  },
  emptyResults: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    lineHeight: 19,
  },
  button: {
    flex: 1,
  },
  iconContainer: {
    borderRadius: 26,
    height: 26,
    width: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  buttonContainer: {
    paddingTop: 24,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 24,
    flexDirection: "row",
  },
});
