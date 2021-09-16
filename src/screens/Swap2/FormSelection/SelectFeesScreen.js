/* @flow */
import { BigNumber } from "bignumber.js";

import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";

import type {
  Account,
  AccountLikeArray,
} from "@ledgerhq/live-common/lib/types";
import { TrackScreen } from "../../../analytics";
import { ScreenName } from "../../../const";

import type { SwapRouteParams } from "..";
import SendRowsFee from "../../../components/SendRowsFee";
import NavigationScrollView from "../../../components/NavigationScrollView";

type Props = {
  accounts: Account[],
  allAccounts: AccountLikeArray,
  navigation: any,
  route: { params: SwapRouteParams },
};

export default function SelectFees({ navigation, route }: Props) {
  const { transaction } = route.params;
  const { account, parentAccount } = route.params;

  // Tmp: fixed networkInfo while waiting for ll-common to build complete transaction info
  transaction.networkInfo.gasPrice = {
    min: new BigNumber(600000),
    initial: new BigNumber(300000),
    max: new BigNumber(90000),
    step: new BigNumber(5000),
    steps: new BigNumber(103),
  };
  transaction.networkInfo.feeItems = {
    items: [
      { feePerByte: new BigNumber(9), key: "3", speed: "medium" },
      { feePerByte: new BigNumber(6), key: "6", speed: "slow" },
    ],
  };

  const onSetTransaction = updatedTransaction => {
    navigation.navigate(ScreenName.SwapForm, {
      ...route.params,
      transaction: updatedTransaction,
    });
  };

  return (
    <SafeAreaView style={[styles.root]}>
      <TrackScreen category="ReceiveFunds" name="SelectAccount" />
      <NavigationScrollView>
        <SendRowsFee
          setTransaction={onSetTransaction}
          account={account}
          parentAccount={parentAccount}
          transaction={transaction}
          navigation={navigation}
          route={{
            ...route,
            params: { ...route.params, currentNavigation: ScreenName.SwapForm },
          }}
        />
      </NavigationScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
