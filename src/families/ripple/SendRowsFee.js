/* @flow */
import React from "react";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ripple/types";

import RippleFeeRow from "./RippleFeeRow";

type Props = {
  transaction: Transaction,
  account: AccountLike,
  navigation: *,
};
export default function RippleSendRowsFee({ account, ...props }: Props) {
  if (account.type !== "Account") return null;

  return <RippleFeeRow {...props} account={account} />;
}
