import React, { useCallback, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import Text from "@components/Text";
import { Theme } from "@ui/styles/theme";
import getButtonStyle, { ButtonTypes, getButtonColor } from "./getButtonStyle";
import { ActivityIndicator } from "react-native";

type Props = {
  Icon?: React.ComponentType<{ size: number; color: string }>;
  children?: React.ReactNode;
  onPress: () => Promise<any> | any;
  type?: ButtonTypes;
  iconPosition?: "right" | "left";
  disabled?: boolean;
};

const IconContainer = styled.View<{
  iconPosition: "right" | "left";
  iconButton?: boolean;
}>`
  ${(p) =>
    p.iconButton
      ? ""
      : p.iconPosition === "left"
      ? `margin-right: 10px;`
      : `margin-left: 10px;`}
`;

export const Base = styled.TouchableOpacity<{
  type?: ButtonTypes;
  disabled?: boolean;
  theme: Theme;
  iconButton?: boolean;
}>`
  border-radius: ${(p) => p.theme.space[6]}px;
  height: ${(p) => p.theme.space[6]}px;
  flex-direction: row;
  border-style: solid;
  border-width: 1px;
  text-align: center;
  align-items: center;
  justify-content: center;
  align-content: center;
  background-color: transparent;
  border-color: transparent;
  overflow: hidden;
  position: relative;
  ${(p) =>
    getButtonStyle({
      type: p.type || undefined,
      disabled: p.disabled,
      theme: p.theme,
    })}
  ${(p) => (p.iconButton ? `padding: 0; width: ${p.theme.space[6]}px;` : "")}
`;

const Container = styled.View<{
  hide?: boolean;
}>`
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
  align-content: center;
  opacity: ${(p) => (p.hide ? 0 : 1)};
`;

const SpinnerContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Button = ({
  Icon,
  iconPosition = "right",
  children,
  onPress,
  disabled = false,
  ...props
}: Props): React.ReactElement => {
  const [spinnerOn, setSpinnerOn] = useState(false);
  const theme = useTheme();
  const { color } = getButtonColor({ ...props, theme });
  const onPressHandler = useCallback(async () => {
    if (!onPress) return;
    let isPromise;
    try {
      const res = onPress();
      isPromise = !!res && !!res.then;
      if (isPromise) {
        // it's a promise, we will use pending state
        setSpinnerOn(true);
        await res;
      }
    } finally {
      if (isPromise) {
        setSpinnerOn(false);
      }
    }
  }, [onPress]);

  return (
    <Base
      {...props}
      iconButton={Icon && !children}
      disabled={disabled || spinnerOn}
      onPress={onPressHandler}
    >
      <Container hide={spinnerOn}>
        {iconPosition === "right" && children ? (
          <Text type="body" color={color}>
            {children}
          </Text>
        ) : null}
        {Icon ? (
          <IconContainer iconButton={!children} iconPosition={iconPosition}>
            <Icon size={15} color={color} />
          </IconContainer>
        ) : null}
        {iconPosition === "left" && children ? (
          <Text type="body" color={color}>
            {children}
          </Text>
        ) : null}
      </Container>
      <SpinnerContainer>
        <ActivityIndicator
          color={theme.colors.palette.text.tertiary}
          animating={spinnerOn}
        />
      </SpinnerContainer>
    </Base>
  );
};

export default Button;
