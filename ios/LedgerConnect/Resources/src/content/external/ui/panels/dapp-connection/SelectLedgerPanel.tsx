import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Chain } from '../../../../domain/chain';
import { ConnectDeviceImage } from '../../images/connect-device-image';

interface SelectLedgerPanelProps {
  chain: Chain;
}

const Body = styled.div`
  padding: 27px 16px 30px;
`;

const ConnectDeviceImageContainer = styled.div`
  padding-bottom: 24px;
  & > * {
    margin: auto;
  }
`;

const Headline = styled.div`
  font-size: 20px;
  padding-bottom: 8px;
`;

const Subtitle = styled.div`
  font-family: 'Inter';
  font-size: 15px;
  font-weight: 500;
  opacity: 80%;
  padding-bottom: 50px;
`;

const rotate = keyframes`
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  font-size: 10px;
  margin: 0 auto;
  text-indent: -9999em;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: #ffffff;
  background: linear-gradient(to right, #bbb0ff 10%, rgba(255, 255, 255, 0) 42%);
  position: relative;
  -webkit-animation: ${rotate} 1.4s infinite linear;
  animation: ${rotate} 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  &:before {
    width: 50%;
    height: 50%;
    background: #bbb0ff;
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  &:after {
    background: #00000d;
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

export function SelectLedgerPanel({ chain }: SelectLedgerPanelProps): JSX.Element {
  const formattedChainName = chain.charAt(0).toUpperCase() + chain.slice(1);
  return (
    <Body>
      <ConnectDeviceImageContainer>{ConnectDeviceImage}</ConnectDeviceImageContainer>
      <Headline>SELECT YOUR LEDGER NANO X</Headline>
      <Subtitle>Make sure your device is unlocked with the {formattedChainName} app installed and open.</Subtitle>
      <Spinner />
    </Body>
  );
}
