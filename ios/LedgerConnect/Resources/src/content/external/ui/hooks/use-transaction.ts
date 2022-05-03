import { useState } from 'react';
import assert from 'assert';
import { Chain } from '../../../domain/chain';
import { Transaction } from '../../../domain/transaction';
import { TransactionStore } from '../../../domain/transaction/transaction-store';
import * as EthereumTransactionStore from '../../stores/transaction/ethereum-transaction-store';
import * as SolanaTransactionStore from '../../stores/transaction/solana-transaction-store';
import { useRequest } from './request-context';
import { RequestType } from '../../../use-case/dto/dapp-request';

export enum TransactionState {
  Initiated,
  WaitingForConfirmation,
  TransactionInProgress,
  Complete,
  Failed,
}

type ErrorMessage = string | undefined;

type ContinueTransactionFunction = () => void;

type ResetFunction = () => void;

const transactionStores: { [key in Chain]: TransactionStore } = {
  [Chain.Ethereum]: EthereumTransactionStore,
  [Chain.Solana]: SolanaTransactionStore,
};

export const useTransaction = (): [
  TransactionState,
  Transaction,
  ErrorMessage,
  ContinueTransactionFunction,
  ResetFunction,
] => {
  const { request, handleResponse, handleComplete } = useRequest();
  assert(request, 'expecting request to be defined in use-dapp-connection');
  assert(handleResponse, 'expecting handleResponse to be defined in use-dapp-connection');
  assert(handleComplete, 'expecting handleComplete to be defined in use-dapp-connection');
  const [state, setState] = useState(TransactionState.Initiated);
  const [error, setError] = useState<string>();

  const chain = request.getChain();
  const store = transactionStores[chain];

  const transaction = store.mapTransaction(request);

  const requestType = request.getType();

  const reset = () => {
    handleComplete();
    setState(TransactionState.Initiated);
  };

  const handleTransaction = () => {
    if (requestType === RequestType.SignTransaction) {
      reset();
    } else {
      setState(TransactionState.TransactionInProgress);
    }
  };

  const continueTransaction = async () => {
    setState(TransactionState.WaitingForConfirmation);

    try {
      await store.processTransaction({
        request,
        onTransactionSigned: handleTransaction,
        onResponse: handleResponse,
      });

      if (requestType === RequestType.SignTransaction) {
        return;
      }

      setState(TransactionState.Complete);
    } catch (newError) {
      if (newError instanceof Error) {
        setError(newError.message);
      } else {
        setError(`Error in use-transaction: ${newError}`);
      }
    }
  };

  return [state, transaction, error, continueTransaction, reset];
};
