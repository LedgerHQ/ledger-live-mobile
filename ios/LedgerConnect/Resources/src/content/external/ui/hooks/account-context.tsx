import React, { useEffect, useState } from 'react';
import assert from 'assert';
import { Chain } from '../../../domain/chain';
import { Account } from '../../../domain/ledger/account';
import * as EthereumDappConnectionStore from '../../stores/account/ethereum-account-connection-store';
import * as SolanaDappConnectionStore from '../../stores/account/solana-account-connection-store';
import { DappConnectionStore, ApproveAccountFunction } from '../../../domain/dapp-information/dapp-connection-store';
import { useRequest } from './request-context';
import { TokenValue } from '../../../domain/currency/token-value';

interface AccountProviderProps {
  children: React.ReactNode;
}

export type AccountAction =
  | {
      type: 'setAccount';
      account: Account;
    }
  | {
      type: 'approveAccountForCurrentDapp';
    };

export type AccountState =
  | {
      account: undefined;
      approvedForCurrentDapp: false;
    }
  | {
      account: Account;
      approvedForCurrentDapp: boolean;
    };

const initialAccountState: AccountState = {
  account: undefined,
  approvedForCurrentDapp: false,
};

const AccountStateContext = React.createContext<AccountState>(initialAccountState);
const AccountDispatchContext = React.createContext<React.Dispatch<AccountAction> | undefined>(undefined);

function accountReducer(state: AccountState, action: AccountAction): AccountState {
  const { type } = action;
  switch (type) {
    case 'setAccount':
      return {
        account: action.account,
        approvedForCurrentDapp: false,
      };
    case 'approveAccountForCurrentDapp':
      assert(state.account, 'account must be defined in order to approve the account for the current dapp');
      return {
        ...state,
        approvedForCurrentDapp: true,
      };

    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

export function AccountProvider({ children }: AccountProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(accountReducer, initialAccountState);
  return (
    <AccountStateContext.Provider value={state}>
      <AccountDispatchContext.Provider value={dispatch}>{children}</AccountDispatchContext.Provider>
    </AccountStateContext.Provider>
  );
}

export enum AccountRequestState {
  WaitingForDevice,
  RequireApproval,
  Approved,
}

type ErrorMessage = string | undefined;

type ApproveConnectionFunction = () => void;

type ResetFunction = () => void;

const dappConnectionStores: { [key in Chain]: DappConnectionStore } = {
  [Chain.Ethereum]: EthereumDappConnectionStore,
  [Chain.Solana]: SolanaDappConnectionStore,
};

export const useAccountRequest = (): {
  state: AccountRequestState;
  accountToApprove: Account | undefined;
  accountValue: TokenValue | undefined;
  errorMessage: ErrorMessage;
  handleApproveConnection: ApproveConnectionFunction;
  handleReset: ResetFunction;
} => {
  const { request, handleResponse, handleComplete } = useRequest();
  assert(request, 'expecting request to be defined in use-transaction');
  assert(handleResponse, 'expecting handleResponse to be defined in use-transaction');
  assert(handleComplete, 'expecting handleComplete to be defined in use-transaction');

  const dispatch = React.useContext(AccountDispatchContext);
  assert(dispatch, 'dispatch must be set in useAccountRequest');

  const [state, setState] = useState(AccountRequestState.WaitingForDevice);
  const [handleApproveAccount, setHandleApproveAccount] = useState<ApproveAccountFunction>();
  const [accountToApprove, setAccountToApprove] = useState<Account>();
  const [accountValue, setAccountValue] = useState<TokenValue>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    const requestAccount = async () => {
      const chain = request.getChain();
      const store = dappConnectionStores[chain];

      try {
        const {
          handleApproveAccount: newHandleApproveAccount,
          accountToApprove: newAccountToApprove,
          getAccountValue,
        } = await store.processAccountConnection({
          request,
          dispatch,
          onResponse: handleResponse,
        });
        setHandleApproveAccount(() => newHandleApproveAccount);
        setAccountToApprove(newAccountToApprove);
        setState(AccountRequestState.RequireApproval);

        const newAccountValue = await getAccountValue();
        setAccountValue(newAccountValue);
      } catch (newError) {
        if (newError instanceof Error) {
          setErrorMessage(newError.message);
        } else {
          setErrorMessage(`Error in use-transaction: ${newError}`);
        }
      }
    };
    requestAccount();
  }, [request, dispatch, handleResponse]);

  const handleApproveConnection = () => {
    assert(handleApproveAccount, 'handleApproveAccount is undefined while trying to approve the connection');
    handleApproveAccount();
    setState(AccountRequestState.Approved);
  };

  const handleReset = () => {
    handleComplete();
    setState(AccountRequestState.WaitingForDevice);
  };

  return {
    state,
    accountToApprove,
    accountValue,
    errorMessage,
    handleApproveConnection,
    handleReset,
  };
};

export function useApprovedAccount(): Account | undefined {
  const context = React.useContext(AccountStateContext);
  if (context === undefined) {
    throw new Error('useApprovedAccount must be used within an AccountProvider');
  }
  const { account, approvedForCurrentDapp } = context;
  return approvedForCurrentDapp ? account : undefined;
}
