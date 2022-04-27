import React from 'react';
import styled from 'styled-components';

import { Button } from '../../components/Button';
import { Account } from '../../../../domain/ledger/account';
import { TokenValue } from '../../../../domain/currency/token-value';
import { useChain } from '../../hooks/chain-context';

interface ConnectToDappPanelProps {
  onCancel: () => void;
  onConnect: () => void;
  account: Account;
  accountValue: TokenValue;
}

/**
 * Header
 */

const Header = styled.div`
  padding-top: 25px;
  padding-bottom: 12px;
  border-bottom: 1px solid #222222;
`;

const IconImage = styled.img`
  width: 46px;
  border-radius: 23px;
  margin: 0 auto 15px;
`;

const HeaderTitle = styled.div`
  font-size: 24px;
  line-height: 28.8px;
  margin-bottom: 12px;
`;

const HeaderSubtitle = styled.div`
  font-size: 13px;
  opacity: 80%;
  margin-bottom: 12px;
`;

/**
 * WalletStack
 */

const WalletStack = styled.div`
  padding: 25px 24px 33px;
`;

const WalletIntro = styled.div`
  margin-bottom: 8px;
  text-align: left;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  gap: 4px;
`;

const WalletInfo = styled.div`
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
  display: flex;
  & > *:not(:first-child) {
    margin-left: 14px;
  }
`;

export function ConnectToDappPanel({
  onCancel,
  onConnect,
  account,
  accountValue,
}: ConnectToDappPanelProps): JSX.Element {
  const { chainTokenIcon, dappInformationStore } = useChain();

  const accountFormatted = account.getConcatenated() || '';
  const accountValueFormatted = accountValue.getValueDecimalFormatted(9);
  const dappInformation = dappInformationStore.getDappInformation();
  const dappName = dappInformation.getName().toUpperCase();
  const dappHostname = dappInformation.getHostname().toLowerCase();
  const dappIcon = dappInformation.getIconURL();

  return (
    <>
      <Header>
        <IconImage src={dappIcon} />
        <HeaderTitle>CONNECT TO {dappName}</HeaderTitle>
        <HeaderSubtitle>{dappHostname}</HeaderSubtitle>
      </Header>
      <WalletStack>
        <WalletIntro>Default Wallet</WalletIntro>
        <WalletInfo>
          <TokenIcon>{chainTokenIcon}</TokenIcon>
          <WalletInfoTextContainer>
            <WalletInfoTextBold>{accountFormatted}</WalletInfoTextBold>
            <WalletInfoTextBold>{accountValueFormatted}</WalletInfoTextBold>
          </WalletInfoTextContainer>
        </WalletInfo>
      </WalletStack>
      <Buttons>
        <Button onTouch={onCancel}>Cancel</Button>
        <Button primary onTouch={onConnect}>
          Continue
        </Button>
      </Buttons>
    </>
  );
}
