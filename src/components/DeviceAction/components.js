// @flow
import { View, StyleSheet } from "react-native";
import React from "react";
import LText from "../LText";

export function OpenAppRequest({ wording }: { wording: string }) {
  return (
    <Wrapper>
      <LText>Open {wording} App</LText>
    </Wrapper>
  );
}

export function ConnectDevice() {
  return (
    <Wrapper>
      <LText>Connect your device</LText>
    </Wrapper>
  );
}

export function Loading() {
  return (
    <Wrapper style={styles.wrapper}>
      <LText>Loading...</LText>
    </Wrapper>
  );
}

function Wrapper({ children }: { children: React$Node }) {
  return <View style={styles.wrapper}>{children}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
