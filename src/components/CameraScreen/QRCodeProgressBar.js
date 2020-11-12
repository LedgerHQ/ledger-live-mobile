// @flow
import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import ProgressCircle from "react-native-progress/Circle";

import { useTheme } from "@react-navigation/native";
import { getFontStyle } from "../LText";

type Props = {
  progress?: number,
  viewFinderSize: number,
};

function QrCodeProgressBar({ progress, viewFinderSize }: Props) {
  const { colors } = useTheme();
  return typeof progress === "number" ? (
    <View style={styles.centered}>
      <ProgressCircle
        showsText={!!progress}
        progress={progress}
        color={colors.white}
        borderWidth={0}
        thickness={progress ? 4 : 0}
        size={viewFinderSize / 4}
        strokeCap="round"
        textStyle={[
          styles.progressText,
          { color: colors.white },
          getFontStyle({ semiBold: true }),
        ]}
      />
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 16,
  },
});

export default memo<Props>(QrCodeProgressBar);
