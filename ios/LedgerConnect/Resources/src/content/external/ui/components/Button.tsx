import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children?: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onTouch?: () => void;
}

const Container = styled.div<{ primary?: boolean; disabled?: boolean }>`
  width: 100%;
  border-radius: 48px;
  height: 56px;
  color: #ffffff;
  background-color: #00000d;
  border: 1px solid #ffffff;
  text-align: center;
  vertical-align: middle;
  line-height: 56px;
  font-weight: 600;
  font-size: 16px;
  user-select: none;

  ${(props) =>
    props.primary &&
    css`
      background-color: #ffffff;
      color: #00000d;
    `}

  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.2;
    `}

  &:active {
    ${(props) =>
      !props.disabled &&
      css`
        opacity: 0.5;
      `}
  }
`;

export function Button({ children, primary, disabled, onTouch }: ButtonProps): JSX.Element {
  const handleTouch = () => {
    if (disabled) {
      return;
    }
    onTouch?.();
  };

  return (
    <Container primary={primary} disabled={disabled} onTouchEnd={handleTouch}>
      {children}
    </Container>
  );
}

Button.defaultProps = {
  children: '',
  primary: false,
  disabled: false,
  onTouch: undefined,
};
