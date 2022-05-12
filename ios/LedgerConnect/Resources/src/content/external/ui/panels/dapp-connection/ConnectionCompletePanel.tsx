import React from 'react';
import styled from 'styled-components';

import { Button } from '../../components/Button';
import GreenCheckIcon from '../../images/green-check.svg';
import { Account } from '../../../../domain/ledger/account';
import { TokenValue } from '../../../../domain/currency/token-value';
import { useChain } from '../../hooks/chain-context';

interface TransactionCompletePanelProps {
  onDone: () => void;
  account: Account;
  accountValue: TokenValue;
}

/**
 * Header
 */

const Header = styled.div`
  font-size: 24px;
  line-height: 28.8px;
  padding: 24px 0 16px;
`;

const ReviewTransactionImage = styled.div`
  padding-bottom: 24px;
  & > * {
    margin: auto;
  }
`;

const HeaderTitle = styled.div`
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 6px;
`;

const HeaderMessage = styled.div`
  font-size: 15px;
  line-height: 19px;
  opacity: 0.8;
`;

/**
 * WalletInfo
 */

const WalletInfo = styled.div`
  margin: 0 24px 33px;
  padding: 14px;
  background: #131326;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const TokenIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 12px;
`;

const WalletInfoTextContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 2px;
  width: 100%;
  & > *:nth-child(odd) {
    text-align: left;
  }
  & > *:nth-child(even) {
    text-align: right;
  }
`;

const WalletInfoTextBold = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const WalletInfoTextNormal = styled.div`
  font-size: 15px;
  opacity: 0.8;
`;

/**
 * Buttons
 */

const Buttons = styled.div`
  padding: 0 24px 13px;
`;

export function ConnectionCompletePanel({ onDone, account, accountValue }: TransactionCompletePanelProps): JSX.Element {
  const { chainTokenIcon, dappInformationStore } = useChain();
  const accountFormatted = account.getConcatenated() || '';
  const accountValueFormatted = accountValue.getValueDecimalFormatted();
  const dappInformation = dappInformationStore.getDappInformation();
  const dappHostname = dappInformation.getHostname().toLowerCase();

  return (
    <>
      <Header>
        <ReviewTransactionImage>
          <GreenCheckIcon />
        </ReviewTransactionImage>
        <HeaderTitle>CONNECTED SUCCESSFULLY</HeaderTitle>
        <HeaderMessage>{dappHostname}</HeaderMessage>
      </Header>
      <WalletInfo>
        <TokenIcon>{chainTokenIcon}</TokenIcon>
        <WalletInfoTextContainer>
          <WalletInfoTextBold>{accountFormatted}</WalletInfoTextBold>
          <WalletInfoTextBold>{accountValueFormatted}</WalletInfoTextBold>
        </WalletInfoTextContainer>
      </WalletInfo>
      <Buttons>
        <Button primary onTouch={onDone}>
          DONE
        </Button>
      </Buttons>
    </>
  );
}
