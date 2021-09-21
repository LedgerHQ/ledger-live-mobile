/* @flow */
import React, { useCallback } from "react";
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

  const onSetTransaction = useCallback(updatedTransaction => {
    navigation.navigate(ScreenName.SwapForm, {
      ...route.params,
      transaction: updatedTransaction,
    });
  }, [navigation, route.params]);

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
