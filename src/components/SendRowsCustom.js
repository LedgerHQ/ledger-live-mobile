/* @flow */
import React from "react";
import type { Account } from "@ledgerhq/live-common/lib/types";
import perFamily from "../generated/SendRowsCustom";

export default ({
  transaction,
  account,
  navigation,
}: {
  transaction: *,
  account: Account,
  navigation: *,
}) => {
  const C = perFamily[account.currency.family];
  return C ? (
    <C transaction={transaction} account={account} navigation={navigation} />
  ) : null;
};
