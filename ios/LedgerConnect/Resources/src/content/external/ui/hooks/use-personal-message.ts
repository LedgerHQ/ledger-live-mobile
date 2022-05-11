import { useState } from 'react';
import assert from 'assert';
import { Chain } from '../../../domain/chain';
import * as EthereumPersonalMessageStore from '../../stores/personal-message/ethereum-personal-message-store';
import * as SolanaPersonalMessageStore from '../../stores/personal-message/solana-personal-message-store';
import { useRequest } from './request-context';
import { PersonalMessageStore } from '../../../domain/personal-message/personal-message-store';
import { PersonalMessage } from '../../../domain/personal-message';

export enum PersonalMessageState {
  Initiated,
  WaitingForConfirmation,
}

type ErrorMessage = string | undefined;

type SignMessageFunction = () => void;

type ResetFunction = () => void;

const personalMessageStores: { [key in Chain]: PersonalMessageStore } = {
  [Chain.Ethereum]: EthereumPersonalMessageStore,
  [Chain.Solana]: SolanaPersonalMessageStore,
};

export const usePersonalMessage = (): [
  PersonalMessageState,
  PersonalMessage,
  ErrorMessage,
  SignMessageFunction,
  ResetFunction,
] => {
  const { request, handleResponse, handleComplete } = useRequest();
  assert(request, 'expecting request to be defined in use-personal-message');
  assert(handleResponse, 'expecting handleResponse to be defined in use-personal-message');
  assert(handleComplete, 'expecting handleComplete to be defined in use-personal-message');
  const [state, setState] = useState(PersonalMessageState.Initiated);
  const [error, setError] = useState<string>();

  const chain = request.getChain();
  const store = personalMessageStores[chain];

  const personalMessage = store.mapPersonalMessage(request);

  const reset = () => {
    handleComplete();
    setState(PersonalMessageState.Initiated);
  };

  const continuePersonalMessageSigning = async () => {
    setState(PersonalMessageState.WaitingForConfirmation);

    try {
      await store.processPersonalMessage({
        request,
        onPersonalMessageSigned: reset,
        onResponse: handleResponse,
      });
    } catch (newError) {
      if (newError instanceof Error) {
        setError(newError.message);
      } else {
        setError(`Error in use-transaction: ${newError}`);
      }
    }
  };

  return [state, personalMessage, error, continuePersonalMessageSigning, reset];
};
