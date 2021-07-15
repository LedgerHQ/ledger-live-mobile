import React from 'react';
import styled, {useTheme} from 'styled-components/native';

import {
  fontSize,
  fontWeight,
  textAlign,
  color,
  space,
  lineHeight,
  letterSpacing,
} from 'styled-system';
import BracketRight from '@ui/icons/BracketLeft';
import BracketLeft from '@ui/icons/BracketRight';

import {ThemedComponent} from '@ui/styles/StyleProvider';
import getTextStyle, {TextTypes} from './getTextStyle';
import {getColor} from '~/styles';

type FontFamilies =
  | 'Inter|ExtraLight'
  | 'Inter|Light'
  | 'Inter|Regular'
  | 'Inter|Medium'
  | 'Inter|SemiBold'
  | 'Inter|Bold'
  | 'Inter|ExtraBold'
  | 'Alpha|Medium';

type Props = {
  type: TextTypes;
  fontFamily?: string;
  fontSize?: number | string;
  textAlign?: string;
  color?: string;
  fontWeight?: string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  lineHeight?: string;
  bracket?: boolean;
  children: React.ReactNode;
};

const Base = styled.Text`
  ${lineHeight};
  ${fontSize};
  ${textAlign};
  ${color};
  ${fontWeight};
  ${space};
  ${letterSpacing};
  ${p => getTextStyle(p)}
  justify-content: center;
  align-items: center;
`;

const T = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const BracketText = ({
  children,
  color = 'palette.text.default',
  ...props
}: Props) => {
  const {lineHeight: size} = getTextStyle(props);
  const theme = useTheme();
  const c = theme ? getColor(theme, color) : 'transparent';
  return (
    <T>
      <BracketLeft fill={c} width={size} height={size} />
      <Base {...props} color={color} bracket>
        {children}
      </Base>
      <BracketRight fill={c} width={size} height={size} />
    </T>
  );
};

const Text = ({
  children,
  bracket,
  color = 'palette.text.default',
  ...props
}: Props) => {
  if (bracket)
    return (
      <BracketText {...props} color={color}>
        {children}
      </BracketText>
    );

  return (
    <Base {...props} color={color}>
      {children}
    </Base>
  );
};

export default Text;
