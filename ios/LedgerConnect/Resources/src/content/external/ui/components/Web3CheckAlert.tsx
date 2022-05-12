/* eslint-disable react/require-default-props */

import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

export interface Web3CheckAlertProps extends PropsWithChildren<unknown> {
  type: 'info' | 'warning' | 'danger';
  title?: string;
  text?: string;
  bgcolor: string;
  color: string;
}

const Web3CheckPanel = styled.div<{ background?: string; colot?: string }>`
  display: flex;
  gap: 12px;
  ${(props) => {
    const color = (props as any).background;
    return color ? `background-color: ${color};` : '';
  }}

  ${(props) => {
    const { color } = props;
    return color ? `color: ${color}` : '';
  }}
`;

const IconPanel = styled.div`
  display: flex;
  align-items: center;
  padding: 6px;
  padding-right: 0;
`;

const TextMessagePanel = styled.div`
  padding: 12px;
  padding-left: 0;
  text-align: left;
`;

const TextMessageTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
`;

const TextMessageBody = styled.div`
  font-size: 13px;
  font-weight: 500;
  margin: 0;
`;

export function Web3CheckAlert({ type, title, text, bgcolor, color }: Web3CheckAlertProps): JSX.Element | null {
  return (
    <Web3CheckPanel background={bgcolor} color={color}>
      <IconPanel>
        {type === 'info' && <IconPanel>ⓘ</IconPanel>}
        {type === 'warning' && <IconPanel>!&#x20DD;</IconPanel>}
        {type === 'danger' && <IconPanel>×&#x20DD;</IconPanel>}
      </IconPanel>

      <TextMessagePanel>
        {title && <TextMessageTitle>{title}</TextMessageTitle>}
        {text && <TextMessageBody>{text}</TextMessageBody>}
      </TextMessagePanel>
    </Web3CheckPanel>
  );
}
