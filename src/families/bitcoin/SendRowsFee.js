/* @flow */
import invariant from "invariant";
import React, { useCallback, useState } from "react";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { Trans } from "react-i18next";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { useFeesStrategy } from "@ledgerhq/live-common/lib/families/bitcoin/react";
import { ScreenName } from "../../const";
import SelectFeesStrategy from "../../components/SelectFeesStrategy";

type Props = {
  transaction: Transaction,
  account: AccountLike,
  parentAccount: ?Account,
  navigation: *,
  route: { params: RouteParams },
  setTransaction: Function,
};

export default function BitcoinSendRowsFee({
  account,
  transaction,
  parentAccount,
  setTransaction,
  route,
  navigation,
}: Props) {
  invariant(account.type === "Account", "account not found");
  let strategies = useFeesStrategy(account, transaction);
  const [satPerByte, setSatPerByte] = useState(null);

  if (satPerByte) {
    strategies = [
      ...strategies,
      {
        label: "custom",
        amount: satPerByte,
        unit: strategies[0].unit,
      },
    ];
  }

  const onFeesSelected = useCallback(
    ({ amount, label }) => {
      const bridge = getAccountBridge(account, parentAccount);

      setTransaction(
        bridge.updateTransaction(transaction, {
          feesStrategy: label,
          feePerByte: amount,
        }),
      );
    },
    [setTransaction, account, parentAccount, transaction],
  );

  const openCustomFees = useCallback(() => {
    navigation.navigate(ScreenName.BitcoinEditCustomFees, {
      ...route.params,
      accountId: account.id,
      transaction,
      satPerByte,
      setSatPerByte,
    });
  }, [satPerByte, setSatPerByte, navigation, account.id, transaction]);

  return (
    <>
      <SelectFeesStrategy
        strategies={strategies}
        onStrategySelect={onFeesSelected}
        onCustomFeesPress={openCustomFees}
        account={account}
        parentAccount={parentAccount}
        transaction={transaction}
        forceUnitLabel={<Trans i18nKey="common.satPerByte" />}
      />
    </>
  );
}
