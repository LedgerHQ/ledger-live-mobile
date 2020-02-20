// @flow

import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";

import { withNavigation } from "@react-navigation/compat";

import { Trans } from "react-i18next";
import Icon from "react-native-vector-icons/dist/Feather";
import Touchable from "../Touchable";
import colors from "../../colors";
import LText from "../LText";
import Circle from "../Circle";

type Props = {
  navigation: *,
  onPress: () => *,
};

class PairNewDeviceButton extends PureComponent<Props> {
  render() {
    return (
      <Touchable event="AddDevice" onPress={this.props.onPress}>
        <View style={styles.root}>
          <Circle bg={colors.pillActiveBackground} size={30}>
            <Icon name="plus" size={20} color={colors.pillActiveForeground} />
          </Circle>
          <LText semiBold style={styles.text}>
            <Trans i18nKey="SelectDevice.deviceNotFoundPairNewDevice" />
          </LText>
        </View>
      </Touchable>
    );
  }
}

// Word of caution, to make the + button align we are not following the
// normal 8s sizing for margins. This is microadjusted.
const styles = StyleSheet.create({
  root: {
    height: 64,
    padding: 16,
    paddingLeft: 9,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.fog,
    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    marginLeft: 15,
    flex: 1,
    color: colors.live,
    fontSize: 16,
  },
});

export default withNavigation(PairNewDeviceButton);
