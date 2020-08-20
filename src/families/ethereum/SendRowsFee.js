/* @flow */
import React from "react";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";

import type { TransactionStatus } from "@ledgerhq/live-common/lib/types/transaction";
import EthereumFeeRow from "./EthereumFeeRow";

type Props = {
  transaction: Transaction,
  account: AccountLike,
  parentAccount: ?Account,
  navigation: *,
  status: TransactionStatus,
};
export default function EthereumSendRowsFee(props: Props) {
  return <EthereumFeeRow {...props} />;
}
