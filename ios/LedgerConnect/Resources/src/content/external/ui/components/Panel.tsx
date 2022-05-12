import React from 'react';
import styled from 'styled-components';

interface PanelProps {
  children?: React.ReactNode;
}

const Container = styled.div`
  color: #ffffff;
  background-color: #00000d;
  font-family: 'Inter';
  text-align: center;
  border-radius: 10px 10px 0px 0px;
  bottom: 0;
  position: absolute;
  width: 100%;
  padding-bottom: 30px;
`;

const Title = styled.div`
  position: relative;
  height: 58px;
  font-size: 17px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  border-bottom: 1px solid #222222;
`;

const TitleText = styled.div`
  font-weight: 600;
  position: absolute;
  margin: 0;
  left: 50%;
  bottom: 11px;
  transform: translate(-50%);
`;

export function Panel({ children }: PanelProps): JSX.Element {
  return (
    <Container>
      <Title>
        <TitleText>Ledger Connect</TitleText>
      </Title>
      {children}
    </Container>
  );
}

Panel.defaultProps = {
  children: '',
};
