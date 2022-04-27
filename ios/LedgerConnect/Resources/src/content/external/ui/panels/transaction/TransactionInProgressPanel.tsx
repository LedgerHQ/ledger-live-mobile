import React from 'react';
import styled from 'styled-components';
import { DonutProgressIndicator } from '../../components/DonutProgressIndicator';

const Body = styled.div`
  padding: 27px 16px 96px;
`;

const IndicatorContainer = styled.div`
  padding-bottom: 24px;
`;

const Headline = styled.div`
  font-size: 20px;
  padding-bottom: 6px;
`;

const Subtitle = styled.div`
  font-family: 'Inter';
  font-size: 15px;
  font-weight: 500;
  opacity: 80%;
`;

export function TransactionInProgressPanel(): JSX.Element {
  return (
    <Body>
      <IndicatorContainer>
        <DonutProgressIndicator timeInMS={4000} />
      </IndicatorContainer>
      <Headline>TRANSACTION IN PROGRESS</Headline>
      <Subtitle>Your transaction is being confirmed on the blockchain.</Subtitle>
    </Body>
  );
}
