import React from 'react';
import styled from 'styled-components';
import Lottie, { Options as LottieOptions } from 'react-lottie';

import { Button } from '../../components/Button';
import ReviewTransactionAnimation from '../../images/review-device-animation.json';
import { PersonalMessage } from '../../../../domain/personal-message';

interface ReviewPersonalMessagePanelProps {
  personalMessage: PersonalMessage;
  onCancel: () => void;
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
  padding-bottom: 29px;
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
  padding: 0 24px;
`;

const animationOptions: LottieOptions = {
  loop: true,
  autoplay: true,
  animationData: ReviewTransactionAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export function ReviewPersonalMessagePanel({
  personalMessage,
  onCancel,
}: ReviewPersonalMessagePanelProps): JSX.Element {
  const personalMessageValue = personalMessage.getValue();

  return (
    <>
      <Header>
        <ReviewTransactionImage>
          <Lottie options={animationOptions} width={136} height={50} />
        </ReviewTransactionImage>
        <HeaderTitle>REVIEW THE PERSONAL MESSAGE</HeaderTitle>
        <HeaderMessage>Confirm the personal message details with Ledger.</HeaderMessage>
      </Header>
      <Body>
        <PersonalMessageInfo>{personalMessageValue}</PersonalMessageInfo>
      </Body>
      <Buttons>
        <Button onTouch={onCancel}>Cancel</Button>
      </Buttons>
    </>
  );
}
