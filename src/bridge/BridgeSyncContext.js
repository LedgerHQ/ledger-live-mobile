// @flow
// Unify the synchronization management for bridges with the redux store
// it handles automatically re-calling synchronize
// this is an even high abstraction than the bridge

import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import type { Account } from "@ledgerhq/live-common/lib/types";
import priorityQueue from "async/priorityQueue";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { updateAccountWithUpdater } from "../actions/accounts";
import { setAccountSyncState } from "../actions/bridgeSync";
import { track } from "../analytics/segment";
import { SYNC_MAX_CONCURRENT } from "../constants";

import logger from "../logger";
import { accountsSelector, isUpToDateSelector } from "../reducers/accounts";
import type { BridgeSyncState } from "../reducers/bridgeSync";
import {
  bridgeSyncSelector,
  syncStateLocalSelector,
} from "../reducers/bridgeSync";

type BridgeSyncProviderProps = {
  children: *,
};

type BridgeSyncProviderOwnProps = BridgeSyncProviderProps & {
  bridgeSync: BridgeSyncState,
  accounts: Account[],
  isUpToDate: boolean,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
  setAccountSyncState: (string, AsyncState) => *,
};

type AsyncState = {
  pending: boolean,
  error: ?Error,
};

export type BehaviorAction =
  | { type: "BACKGROUND_TICK" }
  | { type: "SET_SKIP_UNDER_PRIORITY", priority: number }
  | { type: "SYNC_ONE_ACCOUNT", accountId: string, priority: number }
  | { type: "SYNC_SOME_ACCOUNTS", accountIds: string[], priority: number }
  | { type: "SYNC_ALL_ACCOUNTS", priority: number };

export type Sync = (action: BehaviorAction) => void;

// $FlowFixMe
const BridgeSyncContext = React.createContext((_: BehaviorAction) => {});

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
  bridgeSync: bridgeSyncSelector,
  isUpToDate: isUpToDateSelector,
});

const actions = {
  updateAccountWithUpdater,
  setAccountSyncState,
};

const lastTimeAnalyticsTrackPerAccountId = {};

class Provider extends Component<BridgeSyncProviderOwnProps, Sync> {
  constructor() {
    super();

    const synchronize = (accountId: string, next: () => void) => {
      const state = syncStateLocalSelector(this.props.bridgeSync, {
        accountId,
      });
      if (state.pending) {
        next();
        return;
      }
      const account = this.props.accounts.find(a => a.id === accountId);
      if (!account) {
        next();
        return;
      }

      const bridge = getAccountBridge(account);

      this.props.setAccountSyncState(accountId, { pending: true, error: null });

      const startSyncTime = Date.now();
      const trackedRecently =
        lastTimeAnalyticsTrackPerAccountId[accountId] &&
        startSyncTime - lastTimeAnalyticsTrackPerAccountId[accountId] <
          90 * 1000;
      if (!trackedRecently) {
        lastTimeAnalyticsTrackPerAccountId[accountId] = startSyncTime;
      }
      const trackEnd = event => {
        if (trackedRecently) return;
        const account = this.props.accounts.find(a => a.id === accountId);
        if (!account) return;
        const subAccounts = account.subAccounts || [];
        track(event, {
          duration: (Date.now() - startSyncTime) / 1000,
          currencyName: account.currency.name,
          derivationMode: account.derivationMode,
          freshAddressPath: account.freshAddressPath,
          operationsLength: account.operations.length,
          tokensLength: subAccounts.length,
        });
        if (event === "SyncSuccess") {
          subAccounts.forEach(a => {
            track("SyncSuccessToken", {
              tokenId: getAccountCurrency(a).id,
              tokenTicker: getAccountCurrency(a).ticker,
              operationsLength: a.operations.length,
              parentCurrencyName: account.currency.name,
              parentDerivationMode: account.derivationMode,
            });
          });
        }
      };
      // TODO migrate to the observation mode in future
      bridge.startSync(account, false).subscribe({
        next: accountUpdater => {
          this.props.updateAccountWithUpdater(accountId, accountUpdater);
        },
        complete: () => {
          trackEnd("SyncSuccess");
          this.props.setAccountSyncState(accountId, {
            pending: false,
            error: null,
          });
          next();
        },
        error: error => {
          logger.critical(error);
          if (!error || error.name !== "NetworkDown") {
            trackEnd("SyncError");
          }
          this.props.setAccountSyncState(accountId, {
            pending: false,
            error,
          });
          next();
        },
      });
    };

    const syncQueue = priorityQueue(synchronize, SYNC_MAX_CONCURRENT);
    let skipUnderPriority: number = -1;

    const schedule = (_ids: string[], priority: number) => {
      if (priority < skipUnderPriority) return;
      const ids = _ids.slice(0);
      syncQueue.remove(o => {
        const i = ids.indexOf(o.data);
        if (i !== -1) {
          if (o.priority >= priority) {
            ids.splice(i, 1);
          } else {
            return true;
          }
        }
        return false;
      });
      syncQueue.push(ids, -priority);
    };

    const allAccountIds = () =>
      this.props.accounts
        .slice(0)
        // for now we sync in order for esthetic. might refine later
        // .sort((a, b) => (a.lastSyncDate || 0) - (b.lastSyncDate || 0))
        .map(a => a.id);

    const handlers = {
      BACKGROUND_TICK: () => {
        if (syncQueue.idle()) {
          schedule(allAccountIds(), -1);
        }
      },

      SET_SKIP_UNDER_PRIORITY: ({ priority }) => {
        if (priority === skipUnderPriority) return;
        skipUnderPriority = priority;
        syncQueue.remove(({ priority }) => priority < skipUnderPriority);
        if (priority === -1 && !this.props.isUpToDate) {
          // going back to -1 priority => retriggering a background sync if it is "Paused"
          schedule(allAccountIds(), -1);
        }
      },

      SYNC_ALL_ACCOUNTS: ({ priority }) => {
        schedule(allAccountIds(), priority);
      },

      SYNC_ONE_ACCOUNT: ({ accountId, priority }) => {
        schedule([accountId], priority);
      },

      SYNC_SOME_ACCOUNTS: ({ accountIds, priority }) => {
        schedule(accountIds, priority);
      },
    };

    this.api = (action: BehaviorAction) => {
      const handler = handlers[action.type];
      if (handler) {
        // $FlowFixMe
        handler(action);
      } else {
        console.warn("BridgeSyncContext unsupported action", {
          action,
          type: "syncQueue",
        });
      }
    };
  }

  api: Sync;

  render() {
    return (
      <BridgeSyncContext.Provider value={this.api}>
        {this.props.children}
      </BridgeSyncContext.Provider>
    );
  }
}

export const BridgeSyncProvider = connect(
  mapStateToProps,
  actions,
)(Provider);

export const BridgeSyncConsumer = BridgeSyncContext.Consumer;
