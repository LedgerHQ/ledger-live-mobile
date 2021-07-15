import React, {useMemo, ComponentType} from 'react';
import {ThemeProvider} from 'styled-components/native';
import type {StyledComponent} from 'styled-components';
import {defaultTheme, palettes} from '.';
import type {Theme} from './theme';

type Props = {
  children: React.ReactNode;
  selectedPalette: 'light' | 'dark';
};

export type ThemedComponent<T> = StyledComponent<ComponentType<T>, Theme, any>;

const StyleProvider = ({children, selectedPalette}: Props) => {
  const theme: Theme = useMemo(
    () => ({
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        palette: palettes[selectedPalette],
      },
    }),
    [selectedPalette],
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default StyleProvider;
