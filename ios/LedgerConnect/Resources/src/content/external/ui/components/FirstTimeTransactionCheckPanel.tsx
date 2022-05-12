import React, { useEffect } from 'react';
import { useApiCall } from '../../../hooks/use-api-call';
import { Chain } from '../../../domain/chain';
import { useRequest } from '../hooks/request-context';
import { Web3CheckAlert } from './Web3CheckAlert';
import { getLogger } from '../../../../logging';
import { getWeb3SafetyStore } from '../../stores/web3safety';

const log = getLogger('web3safety');

export interface FirstTimeTransactionCheckPanelProps {
  address: string;
  contract: string;
}

export function FirstTimeTransactionCheckPanel({
  address,
  contract,
}: FirstTimeTransactionCheckPanelProps): JSX.Element | null {
  const { request } = useRequest();
  const chain = request?.getChain() as Chain;
  const store = getWeb3SafetyStore(chain);

  const { data: isFirstTransaction } = useApiCall(store.isFirstTransaction, {
    args: [address, contract],
  });

  useEffect(() => {
    if (address && chain === Chain.Ethereum) {
      log(`FirstTimeTransactionCheckPanel: Begin update transactions for address ${address} on ${chain}`);
      store.updateTransactions(address);
    }
  }, [address, chain, store]);

  if (!isFirstTransaction) {
    return null;
  }

  return (
    <Web3CheckAlert
      type="info"
      color="#D4CCFF"
      bgcolor="#343248"
      title="First Time Transaction"
      text="You haven’t interacted with this contract before. Make sure the details are correct."
    />
  );
}
