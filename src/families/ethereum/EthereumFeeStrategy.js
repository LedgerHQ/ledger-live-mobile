/* @flow */
import React, { useCallback, useState } from "react";
import { StyleSheet, } from "react-native";

import SelectFeesStrategy from "../../components/SelectFeesStrategy"

import { useFeesStrategy } from "@ledgerhq/live-common/lib/families/ethereum/react";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";


type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  navigation: any,
  route: { params: RouteParams },
};

export default function EthereumFeeRow({
  account,
  parentAccount,
  transaction,
  navigation,
  route,
}: Props) {
    const strategies = useFeesStrategy(transaction);
    const onFeesSelected = useCallback(({amount, feesStrategy}) => {
        const bridge = getAccountBridge(account, parentAccount);
        bridge.updateTransaction(transaction, { amount, feesStrategy });
    }, [account, parentAccount, transaction])
  return (
    <>
        <SelectFeesStrategy strategies={strategies} onStrategySelect={onFeesSelected} {...props}/>
    </>
  );
}

const styles = StyleSheet.create({
});