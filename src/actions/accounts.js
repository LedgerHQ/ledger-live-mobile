// @flow

import type { Account } from "@ledgerhq/live-common/lib/types";
import accountModel from "../logic/accountModel";

export const importStore = (state: *) => ({
  type: "ACCOUNTS_IMPORT",
  state: {
    active:
      state && Array.isArray(state.active)
        ? state.active.map(accountModel.decode)
        : [],
  },
});

export const addAccount = (account: Account) => ({
  type: "ACCOUNTS_ADD",
  account,
});

export type UpdateAccountWithUpdater = (
  accountId: string,
  (Account) => Account,
) => *;

export const updateAccountWithUpdater: UpdateAccountWithUpdater = (
  accountId,
  updater,
) => ({
  type: "UPDATE_ACCOUNT",
  accountId,
  updater,
});

export type UpdateAccount = ($Shape<Account>) => *;
export const updateAccount: UpdateAccount = payload =>
  updateAccountWithUpdater(payload.id, (account: Account) => ({
    ...account,
    ...payload,
  }));

export type DeleteAccount = Account => { type: string, payload: Account };
export const deleteAccount: DeleteAccount = payload => ({
  type: "DELETE_ACCOUNT",
  payload,
});
