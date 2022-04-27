import React, { useRef } from 'react';
import styled, { css } from 'styled-components';

import { Button } from '../../components/Button';
import AppIcon from '../../images/app-icon.svg';
import GreenCheckIcon from '../../images/green-check.svg';
import SendArrowIcon from '../../images/send-arrow-icon.svg';
import NetworkFeeSquareIcon from '../../images/network-fee-square-icon.svg';
import { TokenValue } from '../../../../domain/currency/token-value';
import { useChain } from '../../hooks/chain-context';

interface TransactionCompletePanelProps {
  transactionValue: TokenValue;
  onDone: () => void;
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
 * Body
 */

const Body = styled.div`
  padding: 0 16px 25px;
`;

const TransactionDetails = styled.div`
  background: #131326;
  border-radius: 4px;
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 24px;
  & > *:nth-child(odd) {
    justify-content: flex-start;
  }
  & > *:nth-child(even) {
    justify-content: flex-end;
  }
`;

const TransactionDetailsText = styled.div<{ light?: boolean }>`
  font-size: 15px;
  display: flex;
  align-items: flex-end;
  gap: 5px;
  ${(props) =>
    props.light &&
    css`
      opacity: 0.8;
    `}
`;

/**
 * Buttons
 */

const Buttons = styled.div`
  padding: 0 24px;
`;

const getCurrentTime = (): string => {
  const time = new Date();
  const value = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return value.replace(' ', '').toLowerCase();
};

export function TransactionCompletePanel({ transactionValue, onDone }: TransactionCompletePanelProps): JSX.Element {
  const date = useRef(getCurrentTime());

  const { dappInformationStore } = useChain();
  const dappInformation = dappInformationStore.getDappInformation();
  const dappName = dappInformation.getName().toUpperCase();

  const formattedTransactionValue = transactionValue.getValueDecimalFormatted(9);

  return (
    <>
      <Header>
        <ReviewTransactionImage>
          <GreenCheckIcon />
        </ReviewTransactionImage>
        <HeaderTitle>TRANSACTION COMPLETE</HeaderTitle>
        <HeaderMessage>Today at {date.current}</HeaderMessage>
      </Header>
      <Body>
        <TransactionDetails>
          <TransactionDetailsText light>
            <AppIcon /> App
          </TransactionDetailsText>
          <TransactionDetailsText>{dappName}</TransactionDetailsText>
          <TransactionDetailsText light>
            <SendArrowIcon /> Sent
          </TransactionDetailsText>
          <TransactionDetailsText>{formattedTransactionValue}</TransactionDetailsText>
          <TransactionDetailsText light>
            <NetworkFeeSquareIcon /> Network Fee
          </TransactionDetailsText>
          <TransactionDetailsText>Max $12.76</TransactionDetailsText>
        </TransactionDetails>
      </Body>
      <Buttons>
        <Button primary onTouch={onDone}>
          DONE
        </Button>
      </Buttons>
    </>
  );
}
