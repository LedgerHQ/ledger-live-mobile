// @flow

import { useTheme } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RNHoleView } from "react-native-hole-view";
import { Trans } from "react-i18next";
import { context, disableHole } from "./Provider";
import LText from "../../components/LText";

const PortfolioOverlay = () => {
  const { colors } = useTheme();
  const ptContext = useContext(context);

  if (!ptContext.holeConfig) {
    return null;
  }

  return (
    <>
      <View style={styles.fullscreen} />
      <RNHoleView
        style={[
          styles.fullscreen,
          { backgroundColor: colors.darkBlue, opacity: 0.9 },
        ]}
        holes={ptContext.holeConfig.holes}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => disableHole()}
      >
        <LText style={styles.closeText} color="white" bold>
          <Trans i18nKey="producttour.overlay.closeText" />
        </LText>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    backgroundColor: "transparent",
    borderColor: "#FFF",
    borderWidth: 1,
    position: "absolute",
    top: 40,
    right: 16,
    borderRadius: 4,
  },
  closeText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#FFF",
    fontSize: 12,
  },
});

export default PortfolioOverlay;
