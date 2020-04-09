// @flow

import React from "react";
import { StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import LText from "../../components/LText";
import colors from "../../colors";

type Props = FieldWrapperProps & {
  title: string,
  value?: string,
};

export default function Section({
  title,
  value,
  children = (
    <LText style={styles.value} semiBold selectable>
      {value}
    </LText>
  ),
  onPress,
  style,
}: Props) {
  return (
    <SectionWrapper onPress={onPress} style={style}>
      <LText style={styles.title}>{title}</LText>
      {children}
    </SectionWrapper>
  );
}

type FieldWrapperProps = {
  onPress?: () => void,
  children?: any,
  style?: any,
};

function SectionWrapper({ onPress, children, style }: FieldWrapperProps) {
  if (!onPress) {
    return <View style={[styles.wrapper, style]}>{children}</View>;
  }

  return (
    <RectButton style={styles.wrapper} onPress={onPress}>
      {children}
    </RectButton>
  );
}

export const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    color: colors.darkBlue,
  },
  title: {
    fontSize: 14,
    color: colors.grey,
    marginBottom: 8,
  },
  value: {
    color: colors.darkBlue,
  },
});
