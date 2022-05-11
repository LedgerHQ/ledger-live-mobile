import React from 'react';
import styled, { css } from 'styled-components';

import { Button } from '../../components/Button';
import AppIcon from '../../images/app-icon.svg';
import LedgerScreenReviewTransactionPanel from '../../images/ledger-screen-review-image.svg';
import SendArrowIcon from '../../images/send-arrow-icon.svg';
import NetworkFeeSquareIcon from '../../images/network-fee-square-icon.svg';
import PredictedImpactIcon from '../../images/predicted-impact-icon.svg';
import { TokenValue } from '../../../../domain/currency/token-value';
import { FirstTimeTransactionCheckPanel } from '../../components/FirstTimeTransactionCheckPanel';
import { NewContractDomainNamePanel } from '../../components/NewContractDomainNamePanel';
import { ContractAgePanel } from '../../components/ContractAgePanel';
import { useChain } from '../../hooks/chain-context';
import { useTransaction } from '../../hooks/use-transaction';
import { NetworkInformation } from '../../../../../library/web3safety/types';

interface ReviewTransactionPanelProps {
  transactionValue: TokenValue;
  onCancel: () => void;
  from: string;
  to: string;
  networkInformation: NetworkInformation | null;
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

export function ReviewTransactionPanel({
  transactionValue,
  onCancel,
  from,
  to,
  networkInformation,
}: ReviewTransactionPanelProps): JSX.Element {
  const { dappInformationStore } = useChain();
  const dappInformation = dappInformationStore.getDappInformation();
  const dappName = dappInformation.getName().toUpperCase();

  const formattedTransactionValue = transactionValue.getValueDecimalFormatted();

  return (
    <>
      <Header>
        <ReviewTransactionImage>
          <LedgerScreenReviewTransactionPanel />
        </ReviewTransactionImage>
        <HeaderTitle>REVIEW YOUR TRANSACTION</HeaderTitle>
        <HeaderMessage>Confirm the transaction details on your device.</HeaderMessage>
      </Header>
      <Body>
        <NewContractDomainNamePanel />
        <ContractAgePanel address={to} />
        <FirstTimeTransactionCheckPanel address={from} contract={to} />

        <TransactionDetails>
          <TransactionDetailsText light>
            <AppIcon /> App
          </TransactionDetailsText>
          <TransactionDetailsText>{dappName}</TransactionDetailsText>
          <TransactionDetailsText light>
            <SendArrowIcon /> Send
          </TransactionDetailsText>
          <TransactionDetailsText>{formattedTransactionValue}</TransactionDetailsText>
          <TransactionDetailsText light>
            <NetworkFeeSquareIcon /> Network Fee
          </TransactionDetailsText>
          <TransactionDetailsText>{networkInformation?.networkFeeUSD}</TransactionDetailsText>
          <TransactionDetailsText light>
            <PredictedImpactIcon />
            Predicted Impact
          </TransactionDetailsText>
          <TransactionDetailsText>{networkInformation?.predictedImpact}</TransactionDetailsText>
        </TransactionDetails>
      </Body>
      <Buttons>
        <Button onTouch={onCancel}>Cancel</Button>
      </Buttons>
    </>
  );
}
