import React from 'react';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { SignatureRequestIcon } from '../../images/signature-request-icon';
import SignIcon from '../../images/sign-icon.svg';
import { useChain } from '../../hooks/chain-context';
import { PersonalMessage } from '../../../../domain/personal-message';

interface InitiatePersonalMessagePanelProps {
  personalMessage: PersonalMessage;
  onCancel: () => void;
  onContinue: () => void;
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
  padding-bottom: 11px;
  & > * {
    margin: auto;
  }
`;

const HeaderTitle = styled.div`
  font-size: 24px;
  line-height: 28.8px;
  margin-bottom: 4px;
`;

const HeaderSubtitle = styled.div`
  font-size: 13px;
  font-weight: 500;
`;

/**
 * Body
 */

const Body = styled.div`
  padding: 25px 16px;
  border-bottom: 1px solid #222222;
`;

const MessageHeader = styled.div`
  margin-bottom: 8px;
  text-align: left;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  gap: 4px;
`;

const PersonalMessageInfo = styled.div`
  padding: 14px;
  background: #131326;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  text-align: left;
  line-height: 19px;
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

export function InitiatePersonalMessagePanel({
  personalMessage,
  onCancel,
  onContinue,
}: InitiatePersonalMessagePanelProps): JSX.Element {
  const { dappInformationStore } = useChain();

  const dappInformation = dappInformationStore.getDappInformation();
  const dappHostname = dappInformation.getHostname();

  const personalMessageValue = personalMessage.getValue();

  return (
    <>
      <Header>
        <IconContainer>{SignatureRequestIcon}</IconContainer>
        <HeaderTitle>SIGNATURE REQUEST</HeaderTitle>
        <HeaderSubtitle>{dappHostname}</HeaderSubtitle>
      </Header>
      <Body>
        <MessageHeader>
          <SignIcon /> Message to Sign
        </MessageHeader>
        <PersonalMessageInfo>{personalMessageValue}</PersonalMessageInfo>
      </Body>
      <Buttons>
        <Button onTouch={onCancel}>Cancel</Button>
        <Button primary onTouch={onContinue}>
          Continue
        </Button>
      </Buttons>
    </>
  );
}
