/* @flow */

import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import {
  View,
  TextInput as ReactNativeTextInput,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/dist/Ionicons";
import Touchable from "./Touchable";

const TextInput = ({
  containerStyle, // Needed to pass flow, since we call the native TextInput
  withSuggestions,
  innerRef,
  style,
  onInputCleared,
  clearButtonMode,
  value,
  ...otherProps
}: *) => {
  const { colors, dark } = useTheme();
  const [focused, setFocused] = useState(false);

  const flags = {};
  if (!withSuggestions) {
    flags.autoCorrect = false;
  }

  // In order to show the correct close icon on the input we need a custom impl.
  const shouldShowClearButton =
    !!value &&
    ((focused && clearButtonMode === "while-editing") ||
      clearButtonMode === "always");

  return (
    <View style={[styles.container, containerStyle]}>
      <ReactNativeTextInput
        ref={innerRef}
        keyboardAppearance={dark ? "dark" : "light"}
        allowFontScaling={false}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        value={value}
        {...otherProps}
        {...flags}
        style={[style, { color: colors.darkBlue }]}
      />
      {shouldShowClearButton ? (
        <Touchable
          style={styles.clearWrapper}
          event="TextInputClearValue"
          onPress={onInputCleared}
        >
          <Icon name="ios-close-circle" color={colors.grey} size={18} />
        </Touchable>
      ) : null}
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  clearWrapper: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
