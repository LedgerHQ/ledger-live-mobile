import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  isFirstTransaction as checkIsFirstTransaction,
  updateTransactions,
} from '../../../../library/web3safety/tx-interactions';

export interface FirstTimeTransactionCheckPanelProps {
  address: string;
  contract: string;
}

const FirstTimeTransactionWarning = styled.div`
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: #343248;
`;

export function FirstTimeTransactionCheckPanel({
  address,
  contract,
}: FirstTimeTransactionCheckPanelProps): JSX.Element | null {
  const [isFirstTransaction, setIsFirstTransaction] = useState<boolean>(false);

  useEffect(() => {
    if (address) {
      updateTransactions(address);
    }
  }, [address]);

  useEffect(() => {
    (async () => {
      const isFirst = await checkIsFirstTransaction(address, contract);
      setIsFirstTransaction(isFirst);
    })();
  }, [address, contract]);

  if (!isFirstTransaction) {
    return null;
  }

  return (
    <FirstTimeTransactionWarning>
      <b>First Time Transaction</b>
      <p>You haven’t interacted with this contract before. Make sure the details are correct.</p>
    </FirstTimeTransactionWarning>
  );
}
