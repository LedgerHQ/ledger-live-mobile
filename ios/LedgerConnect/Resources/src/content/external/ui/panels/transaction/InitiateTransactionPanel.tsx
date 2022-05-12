import React from 'react';
import styled, { css } from 'styled-components';

import ApprovedBadge from '../../images/approved-badge.svg';
import { Button } from '../../components/Button';
import NetworkFeeIcon from '../../images/network-fee-speed-icon.svg';
import SendArrowIcon from '../../images/send-arrow-icon.svg';
import { TokenValue } from '../../../../domain/currency/token-value';
import { useChain } from '../../hooks/chain-context';
import { NetworkInformation } from '../../../../../library/web3safety/types';

interface InitiateTransactionPanelProps {
  transactionValue: TokenValue;
  onCancel: () => void;
  onContinue: () => void;
  networkInformation: NetworkInformation | null;
}

/**
 * Header
 */

const Header = styled.div`
  font-size: 24px;
  line-height: 28.8px;
  padding-top: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #222222;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const HeaderIcon = styled.div`
  position: relative;
  margin-bottom: 11px;
  width: 46px;
  height: 46px;
`;

const IconImage = styled.img`
  width: 46px;
  border-radius: 23px;
`;

const IconBadge = styled.div`
  position: absolute;
  bottom: -3px;
  right: -3px;
  height: 20px;
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
 * Body
 */

const Body = styled.div`
  padding: 25px 16px;
  border-bottom: 1px solid #222222;
`;

const TransactionType = styled.div`
  margin-bottom: 8px;
  text-align: left;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  gap: 4px;
`;

const TransactionInfo = styled.div`
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

const TransactionInfoTextContainer = styled.div`
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

const TransactionInfoTextBold = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const TransactionInfoTextNormal = styled.div`
  font-size: 15px;
  opacity: 0.8;
`;

/**
 * Buttons
 */

const Buttons = styled.div`
  padding: 13px 17px;
  display: flex;
  & > *:not(:first-child) {
    margin-left: 14px;
  }
`;

/**
 * Footer
 */

const Footer = styled.div`
  padding: 7px 25px 0;
`;

const NetworkInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 6px;
  width: 100%;
  font-size: 15px;
  & > *:nth-child(odd) {
    justify-content: flex-start;
  }
  & > *:nth-child(even) {
    justify-content: flex-end;
  }
`;

const NetworkInfoText = styled.div<{ light?: boolean }>`
  display: flex;
  gap: 3px;
  align-items: flex-end;
  ${(props) =>
    props.light &&
    css`
      opacity: 0.8;
    `}
`;

export function InitiateTransactionPanel({
  transactionValue,
  onCancel,
  onContinue,
  networkInformation,
}: InitiateTransactionPanelProps): JSX.Element {
  const { chainTokenIcon, chainName, chainTokenSymbol, dappInformationStore } = useChain();

  const dappInformation = dappInformationStore.getDappInformation();
  const dappIcon = dappInformation.getIconURL();
  const dappApproved = true;
  const dappName = dappInformation.getName().toUpperCase();
  const dappHostname = dappInformation.getHostname();

  const formattedTransactionValue = transactionValue.getValueDecimalFormatted();

  return (
    <>
      <Header>
        <IconContainer>
          <HeaderIcon>
            <IconImage src={dappIcon} />
            {dappApproved && (
              <IconBadge>
                <ApprovedBadge />
              </IconBadge>
            )}
          </HeaderIcon>
        </IconContainer>
        <HeaderTitle>{dappName} TRANSACTION</HeaderTitle>
        <HeaderSubtitle>{dappHostname}</HeaderSubtitle>
      </Header>
      <Body>
        <TransactionType>
          <SendArrowIcon /> Send
        </TransactionType>
        <TransactionInfo>
          <TokenIcon>{chainTokenIcon}</TokenIcon>
          <TransactionInfoTextContainer>
            <TransactionInfoTextBold>{chainName}</TransactionInfoTextBold>
            <TransactionInfoTextBold>{formattedTransactionValue}</TransactionInfoTextBold>
            <TransactionInfoTextNormal>USD</TransactionInfoTextNormal>
            <TransactionInfoTextNormal>~ $4,328.21</TransactionInfoTextNormal>
          </TransactionInfoTextContainer>
        </TransactionInfo>
      </Body>
      <Buttons>
        <Button onTouch={onCancel}>Cancel</Button>
        <Button primary onTouch={onContinue}>
          Continue
        </Button>
      </Buttons>
      <Footer>
        <NetworkInfo>
          <NetworkInfoText>
            <NetworkFeeIcon /> Network Fee
          </NetworkInfoText>
          <NetworkInfoText>{networkInformation?.networkFeeUSD || '...'}</NetworkInfoText>
          <NetworkInfoText light>{networkInformation?.processingTime || '...'}</NetworkInfoText>
          <NetworkInfoText light>0.01 {chainTokenSymbol}</NetworkInfoText>
        </NetworkInfo>
      </Footer>
    </>
  );
}
