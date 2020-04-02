// @flow
import type { Transaction } from "@ledgerhq/live-common/lib/types";

export function getIsVoted(transaction: Transaction, address: string) {
  return !((transaction.votes || []).findIndex(v => v.address === address) < 0);
}
