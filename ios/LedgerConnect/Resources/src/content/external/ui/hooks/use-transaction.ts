import { useEffect, useMemo, useState } from 'react';
import assert from 'assert';
import { Chain } from '../../../domain/chain';
import { Transaction } from '../../../domain/transaction';
import { TransactionStore } from '../../../domain/transaction/transaction-store';
import * as EthereumTransactionStore from '../../stores/transaction/ethereum-transaction-store';
import * as SolanaTransactionStore from '../../stores/transaction/solana-transaction-store';
import { useRequest } from './request-context';
import { RequestType } from '../../../use-case/dto/dapp-request';
import { NetworkInformation } from '../../../../library/web3safety/types';
import { EthereumTransactionRequest } from '../../../domain/transaction/ethereum/ethereum-transaction-request';
import { getWeb3SafetyStore } from '../../stores/web3safety';
import { config } from '../../../../library/web3safety/config';

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
  NetworkInformation | null,
] => {
  const { request, handleResponse, handleComplete } = useRequest();
  assert(request, 'expecting request to be defined in use-transaction');
  assert(handleResponse, 'expecting handleResponse to be defined in use-transaction');
  assert(handleComplete, 'expecting handleComplete to be defined in use-transaction');
  const [state, setState] = useState(TransactionState.Initiated);
  const [error, setError] = useState<string>();
  const [networkInformation, setNetworkInformation] = useState<NetworkInformation | null>(null);

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

  const web3SafetyStore = getWeb3SafetyStore(chain);
  const props = request.getPayload() as EthereumTransactionRequest;
  const args = useMemo(
    () => ({
      address: props.getFrom(),
      contract: props.getTo(),
      gas: props.getGas(),
      gasPrice: config.blocknative.hardcodedGasPrice,
      value: props.getValue().getValueHex(),
    }),
    [props],
  );

  useEffect(() => {
    (async () => {
      const networkInfo = await web3SafetyStore.simulate(args);

      setNetworkInformation(networkInfo);
    })();
  }, [args, web3SafetyStore, args.address, args.contract, args.gas, args.value]);

  return [state, transaction, error, continueTransaction, reset, networkInformation];
};
