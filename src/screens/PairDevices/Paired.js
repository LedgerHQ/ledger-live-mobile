// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";

import colors from "../../colors";
import LText from "../../components/LText";
import Button from "../../components/Button";
import PairingSuccess from "./assets/PairingSuccess";
import DeviceItemSummary from "../../components/DeviceItemSummary";

class Paired extends PureComponent<{
  device: *,
  onContinue: () => *,
  navigation: *,
}> {
  onEdit = () => {
    const { device, navigation } = this.props;
    navigation.navigate("EditDeviceName", {
      device,
    });
  };

  render() {
    const { device, onContinue } = this.props;
    return (
      <View style={styles.root}>
        <PairingSuccess />
        <LText secondary semiBold style={styles.title}>
          {"Nano X paired with success!"}
        </LText>
        <LText style={styles.description}>
          {
            "You can now use your Nano X on your Ledger Live mobile App to send & receive funds. You can also mange your device on the Manager section"
          }
        </LText>
        <View style={styles.fullContainer}>
          <DeviceItemSummary name={device.name} genuine onEdit={this.onEdit} />
        </View>
        <View style={[styles.fullContainer, styles.buttonContainer]}>
          <Button type="primary" title="Continue" onPress={onContinue} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 38,
  },
  fullContainer: {
    width: "100%",
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 16,
  },
  title: {
    marginTop: 24,
    fontSize: 18,
    color: colors.darkBlue,
  },
  description: {
    maxWidth: 250,
    marginTop: 8,
    marginBottom: 40,
    textAlign: "center",
    fontSize: 14,
  },
});

export default withNavigation(Paired);
