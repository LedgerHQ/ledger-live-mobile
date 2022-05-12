import React from 'react';
import { Chain } from '../../../domain/chain';
import { useApiCall } from '../../../hooks/use-api-call';
import { getWeb3SafetyStore } from '../../stores/web3safety';
import { useRequest } from '../hooks/request-context';
import { Web3CheckAlert } from './Web3CheckAlert';

const AGE_IN_DAYS = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ContractAgePanelProps {
  address: string;
}

export function ContractAgePanel({ address }: ContractAgePanelProps): JSX.Element | null {
  const { request } = useRequest();
  const chain = request?.getChain() as Chain;
  const store = getWeb3SafetyStore(chain);

  const { data: isOldEnough } = useApiCall(store.isContractOlderThan, {
    args: [address, AGE_IN_DAYS * DAY_MS],
  });

  if (isOldEnough) {
    return null;
  }

  return (
    <Web3CheckAlert
      type="warning"
      color="#ff895a"
      bgcolor="#512b1c"
      title="New Contract"
      text={`The contract was deployed ${AGE_IN_DAYS} days ago – make sure you trust the app before proceeding.`}
    />
  );
}
