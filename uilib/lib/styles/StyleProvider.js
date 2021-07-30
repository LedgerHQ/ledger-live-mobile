import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { defaultTheme, palettes } from '.';
const StyleProvider = ({ children, selectedPalette }) => {
    const theme = useMemo(() => ({
        ...defaultTheme,
        colors: {
            ...defaultTheme.colors,
            palette: palettes[selectedPalette],
        },
    }), [selectedPalette]);
    return React.createElement(ThemeProvider, { theme: theme }, children);
};
export default StyleProvider;
