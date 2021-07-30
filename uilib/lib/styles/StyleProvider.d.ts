import React, { ComponentType } from 'react';
import type { StyledComponent } from 'styled-components';
import type { Theme } from './theme';
declare type Props = {
    children: React.ReactNode;
    selectedPalette: 'light' | 'dark';
};
export declare type ThemedComponent<T> = StyledComponent<ComponentType<T>, Theme, any>;
declare const StyleProvider: ({ children, selectedPalette }: Props) => JSX.Element;
export default StyleProvider;
