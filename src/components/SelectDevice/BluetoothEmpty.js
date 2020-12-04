// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Trans } from "react-i18next";
import Button from "../Button";

import image from "../../screens/Onboarding/assets/pinCodeNanoX.png";

import colors from "../../colors";
import LText from "../LText";
import Bluetooth from "../../icons/Bluetooth";

type Props = {
  onPairNewDevice: () => void,
};

class BluetoothEmpty extends PureComponent<Props> {
  render() {
    return (
      <>
        <View style={styles.imageContainer}>
          <Image source={image} resizeMode="contain" style={styles.image} />
        </View>
        <View style={styles.bulletLine}>
          <View
            style={[styles.bulletIcon, { backgroundColor: colors.lightLive }]}
          >
            <Bluetooth size={10} color={colors.live} />
          </View>
          <View style={styles.bulletTextContainer}>
            <LText
              semiBold
              style={[styles.bulletTitle, { color: colors.darkBlue }]}
            >
              <Trans i18nKey="SelectDevice.bluetooth.title" />
            </LText>
            <LText style={[styles.label, { color: colors.darkBlue }]}>
              <Trans i18nKey="SelectDevice.bluetooth.label" />
            </LText>
          </View>
        </View>
        <Button
          event="PairDevice"
          type="primary"
          title={<Trans i18nKey="SelectDevice.deviceNotFoundPairNewDevice" />}
          onPress={this.props.onPairNewDevice}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 0.5,
    minHeight: 100,
    position: "relative",
  },
  image: {
    position: "absolute",
    right: -24,
    top: -24,
    width: "110%",
    height: "100%",
  },
  label: { fontSize: 13, lineHeight: 24 },
  bulletIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
  },
  bulletLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginVertical: 24,
  },
  bulletTextContainer: {
    flexDirection: "column",
    alignContent: "flex-start",
    justifyContent: "flex-start",
    flexShrink: 1,
    marginLeft: 20,
  },
  bulletTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default BluetoothEmpty;
