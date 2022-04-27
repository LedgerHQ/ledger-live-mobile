import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  children?: React.ReactNode;
  primary?: boolean;
  onTouch?: () => void;
}

const Container = styled.div<{ primary?: boolean }>`
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

  &:active {
    opacity: 0.5;
  }

  ${(props) =>
    props.primary &&
    css`
      background-color: #ffffff;
      color: #00000d;
    `}
`;

export function Button({ children, primary, onTouch }: ButtonProps): JSX.Element {
  return (
    <Container primary={primary} onTouchEnd={onTouch}>
      {children}
    </Container>
  );
}

Button.defaultProps = {
  children: '',
  primary: false,
  onTouch: undefined,
};
