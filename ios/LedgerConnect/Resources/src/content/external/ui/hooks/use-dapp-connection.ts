import assert from 'assert';
import { useEffect, useState } from 'react';
import { Chain } from '../../../domain/chain';
import { Account } from '../../../domain/ledger/account';
import * as EthereumDappConnectionStore from '../../stores/dapp/ethereum-dapp-connection-store';
import * as SolanaDappConnectionStore from '../../stores/dapp/solana-dapp-connection-store';
import { DappConnectionStore, StoreAccountFunction } from '../../../domain/dapp-information/dapp-connection-store';
import { useRequest } from './request-context';

export enum DappConnectionState {
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

export const useDappConnection = (): [
  DappConnectionState,
  Account | undefined,
  ErrorMessage,
  ApproveConnectionFunction,
  ResetFunction,
] => {
  const { request, handleResponse, handleComplete } = useRequest();
  assert(request, 'expecting request to be defined in use-dapp-connection');
  assert(handleResponse, 'expecting handleResponse to be defined in use-dapp-connection');
  assert(handleComplete, 'expecting handleComplete to be defined in use-dapp-connection');
  const [state, setState] = useState(DappConnectionState.WaitingForDevice);
  const [account, setAccount] = useState<Account>();
  const [storeAccountAndRespond, setStoreAccountAndRespond] = useState<StoreAccountFunction>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const requestAccount = async () => {
      const chain = request.getChain();
      const store = dappConnectionStores[chain];

      try {
        const { account: newAccount, storeAccountAndRespond: newStoreAccountAndRespond } =
          await store.requestDefaultAccount(request);
        setAccount(newAccount);
        setStoreAccountAndRespond(() => newStoreAccountAndRespond);
        setState(DappConnectionState.RequireApproval);
      } catch (newError) {
        if (newError instanceof Error) {
          setError(newError.message);
        } else {
          setError(`Error in use-dapp-connection: ${newError}`);
        }
      }
    };
    requestAccount();
  }, [request]);

  const approveConnection = () => {
    assert(account, 'account is undefined while trying to approve the connection');
    assert(storeAccountAndRespond, 'storeAccountAndRespond is undefined while trying to approve the connection');
    storeAccountAndRespond(handleResponse);
    setState(DappConnectionState.Approved);
  };

  const reset = () => {
    handleComplete();
    setState(DappConnectionState.WaitingForDevice);
  };

  return [state, account, error, approveConnection, reset];
};
