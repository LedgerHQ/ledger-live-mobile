import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { isContractWhitelisted } from '../../../../library/web3safety/tx-interactions';

export interface NewContractDomainNamePanelProps {
  address: string;
}

const NewContractDomainNameWarning = styled.div`
  font-size: 15px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: #30101b;
`;

export function NewContractDomainNamePanel({ address }: NewContractDomainNamePanelProps): JSX.Element | null {
  const [isAddressWhitelisted, setIsAddressWhitelisted] = useState<boolean>(false);

  useEffect(() => {
    const isWhitelisted = isContractWhitelisted(address);
    setIsAddressWhitelisted(isWhitelisted);
  }, [address]);

  if (!isAddressWhitelisted) {
    return null;
  }

  return (
    <NewContractDomainNameWarning>
      <b>Contract Not Recognised</b>
      <p>This contract isn’t associated with this domain. Make sure you trust the app before proceeding.</p>
    </NewContractDomainNameWarning>
  );
}
