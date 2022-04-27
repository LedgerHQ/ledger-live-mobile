import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isContractOlderThan } from '../../../../library/web3safety/tx-interactions';

const AGE_IN_DAYS = 2;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ContractAgePanelProps {
  address: string;
}

const ContractAgeWarning = styled.div`
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #ff895a;
  background-color: #512b1c;
`;

export function ContractAgePanel({ address }: ContractAgePanelProps): JSX.Element | null {
  const [isOldEnough, setIsOldEnough] = useState<boolean>(false);

  useEffect(() => {
    let isFetching = true;

    (async () => {
      const isOld = await isContractOlderThan(address, AGE_IN_DAYS * DAY_MS);
      if (isFetching) setIsOldEnough(isOld);
    })();

    // set the flag to false to avoid state update
    return () => {
      isFetching = false;
    };
  }, [address]);

  if (!isOldEnough) {
    return null;
  }

  return (
    <ContractAgeWarning>
      <b>New Contract</b>
      <p>The contract was deployed {AGE_IN_DAYS} days ago – make sure you trust the app before proceeding.</p>
    </ContractAgeWarning>
  );
}
