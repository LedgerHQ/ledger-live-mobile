// @flow

import { useTheme } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { RNHoleView } from "react-native-hole-view";
import { Trans } from "react-i18next";
import { context, HOLES } from "./Provider";
import LText from "../../components/LText";

const PortfolioOverlay = () => {
  const { colors } = useTheme();
  const [disabled, setDisabled] = useState();
  const ptContext = useContext(context);

  useEffect(() => {
    if (!ptContext.holeConfig) {
      setDisabled(null);
    }
  }, [ptContext.holeConfig]);

  if (!ptContext.holeConfig || disabled === ptContext.holeConfig) {
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
        holes={HOLES[ptContext.holeConfig]}
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setDisabled(ptContext.holeConfig)}
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
    zIndex: 10,
  },
  closeText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#FFF",
    fontSize: 12,
  },
});

export default PortfolioOverlay;
