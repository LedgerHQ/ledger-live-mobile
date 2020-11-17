// @flow

import React, { memo } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@react-navigation/native";
import Touchable from "../../components/Touchable";
import LText from "../../components/LText";
import { rgba } from "../../colors";
import IconCheck from "../../icons/Check";

type Props = {
  onPress: () => void,
  isChecked?: boolean,
  children: *,
  event: string,
  eventProperties?: Object,
};

function OnboardingChoice({
  onPress,
  children,
  isChecked,
  event,
  eventProperties,
}: Props) {
  const { colors } = useTheme();
  return (
    <Touchable
      event={event}
      eventProperties={eventProperties}
      onPress={onPress}
      style={[
        styles.root,
        isChecked
          ? {
              borderColor: colors.live,
              backgroundColor: rgba(colors.live, 0.1),
            }
          : { borderColor: colors.fog },
      ]}
    >
      <View style={styles.inner}>
        <LText
          semiBold={isChecked}
          style={[styles.text]}
          color={isChecked ? "live" : "grey"}
        >
          {children}
        </LText>
      </View>
      {isChecked && (
        <View style={styles.checkContainer}>
          <IconCheck size={16} color={colors.live} />
        </View>
      )}
    </Touchable>
  );
}

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 4,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  inner: {
    flexGrow: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  checkContainer: {
    marginLeft: 16,
  },
});

export default memo<Props>(OnboardingChoice);
