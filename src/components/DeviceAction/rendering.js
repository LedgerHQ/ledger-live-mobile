// @flow
import { View, StyleSheet } from "react-native";
import React from "react";
// import LottieView from "lottie-react-native";
import LText from "../LText";
import getWindowDimensions from "../../logic/getWindowDimensions";
import Spinning from "../Spinning";
import LiveLogo from "../../icons/LiveLogoIcon";
import colors from "../../colors";

// const anims = {
//   pairing: {
//     anim: require("../../animations/pairing.json"),
//     imageAssetsFolder: undefined,
//   },
// };

export function renderAllowOpeningApp({ wording }: { wording: string }) {
  return (
    <Wrapper>
      <LText>Open {wording} App</LText>
    </Wrapper>
  );
}

export function renderConnectYourDevice() {
  return (
    <Wrapper>
      <LText>Connect your device</LText>
    </Wrapper>
  );
}

type RawProps = {
  t: (key: string) => string,
};

export function renderLoading({ t }: RawProps) {
  return (
    <Wrapper style={styles.wrapper}>
      <View style={styles.spinnerContainer}>
        <Spinning>
          <LiveLogo size={32} color={colors.grey} />
        </Spinning>
      </View>
      <LText style={styles.text}>{t("DeviceAction.loading")}</LText>
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
    minHeight: 160,
  },
  anim: {
    width: getWindowDimensions().width - 2 * 16,
  },
  text: {
    color: colors.darkBlue,
  },
  spinnerContainer: {
    padding: 24,
  },
});
