// @flow
import { handleActions } from "redux-actions";
import { createSelector } from "reselect";
import uniq from "lodash/uniq";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import {
  addAccounts,
  canBeMigrated,
  flattenAccounts,
  getAccountCurrency,
  importAccountsReduce,
} from "@ledgerhq/live-common/lib/account";
import accountModel from "../logic/accountModel";
import { UP_TO_DATE_THRESHOLD } from "../constants";

export type AccountsState = {
  active: Account[],
};

const initialState: AccountsState = {
  active: [],
};

const handlers: Object = {
  ACCOUNTS_IMPORT: (s, { state }) => state,

  ACCOUNTS_USER_IMPORT: (s, { items, selectedAccounts }) => ({
    active: importAccountsReduce(s.active, { items, selectedAccounts }),
  }),

  ACCOUNTS_ADD: (s, { scannedAccounts, selectedIds, renamings }) => ({
    active: addAccounts({
      existingAccounts: s.active,
      scannedAccounts,
      selectedIds,
      renamings,
    }),
  }),

  SET_ACCOUNTS: (
    state: AccountsState,
    { payload }: { payload: Account[] },
  ) => ({
    active: payload,
  }),

  UPDATE_ACCOUNT: (
    state: AccountsState,
    { accountId, updater }: { accountId: string, updater: Account => Account },
  ): AccountsState => {
    function update(existingAccount) {
      if (accountId !== existingAccount.id) return existingAccount;
      return {
        ...existingAccount,
        ...updater(existingAccount),
      };
    }
    return {
      active: state.active.map(update),
    };
  },

  DELETE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => ({
    active: state.active.filter(acc => acc.id !== account.id),
  }),

  CLEAN_CACHE: (state: AccountsState): AccountsState => ({
    active: state.active.map(account => ({
      ...account,
      lastSyncDate: new Date(0),
      operations: [],
      pendingOperations: [],
    })),
  }),
};

// Selectors

export const exportSelector = (s: *) => ({
  active: s.accounts.active.map(accountModel.encode),
});

export const accountsSelector = (s: *): Account[] => s.accounts.active;

export const migratableAccountsSelector = (s: *): Account[] =>
  s.accounts.active.filter(canBeMigrated);

// $FlowFixMe
export const flattenAccountsSelector = createSelector(
  accountsSelector,
  flattenAccounts,
);

// $FlowFixMe
export const flattenAccountsEnforceHideEmptyTokenSelector = createSelector(
  accountsSelector,
  accounts =>
    flattenAccounts(accounts, { enforceHideEmptyTokenAccounts: true }),
);

// $FlowFixMe
export const accountsCountSelector = createSelector(
  accountsSelector,
  acc => acc.length,
);

// $FlowFixMe
export const someAccountsNeedMigrationSelector = createSelector(
  accountsSelector,
  accounts => accounts.some(canBeMigrated),
);

// $FlowFixMe
export const currenciesSelector = createSelector(
  accountsSelector,
  accounts =>
    uniq(flattenAccounts(accounts).map(a => getAccountCurrency(a))).sort(
      (a, b) => a.name.localeCompare(b.name),
    ),
);

// $FlowFixMe
export const cryptoCurrenciesSelector = createSelector(
  accountsSelector,
  accounts =>
    uniq(accounts.map(a => a.currency)).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
);

// $FlowFixMe
export const accountSelector = createSelector(
  accountsSelector,
  (_, { accountId }) => accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
);

// $FlowFixMe
export const accountScreenSelector = createSelector(
  // DEPRECATED
  accountsSelector,
  (_, { navigation }) => navigation.state.params.accountId,
  (accounts, accountId) => accounts.find(a => a.id === accountId),
);

// FIXME rename to accountScreenSeelctor
export const accountAndParentScreenSelector = (state: *, { navigation }: *) => {
  const { accountId, parentId } = navigation.state.params;
  const parentAccount: ?Account =
    parentId && accountSelector(state, { accountId: parentId });
  let account: ?AccountLike;
  if (parentAccount) {
    const { subAccounts } = parentAccount;
    if (subAccounts) {
      account = subAccounts.find(t => t.id === accountId);
    }
  } else {
    account = accountSelector(state, { accountId });
  }
  return { parentAccount, account };
};

const isUpToDateAccount = a => {
  const { lastSyncDate } = a;
  const { blockAvgTime } = a.currency;
  const outdated =
    Date.now() - (lastSyncDate || 0) >
    (blockAvgTime || 0) * 1000 + UP_TO_DATE_THRESHOLD;
  return !outdated;
};

// $FlowFixMe
export const isUpToDateAccountSelector = createSelector(
  accountSelector,
  isUpToDateAccount,
);

// $FlowFixMe
export const isUpToDateSelector = createSelector(
  accountsSelector,
  accounts => accounts.every(isUpToDateAccount),
);

export default handleActions(handlers, initialState);
