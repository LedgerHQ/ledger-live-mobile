/* @flow */

import React, { useCallback, useState } from "react";
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
  onFocus,
  onBlur,
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

  const onWrappedFocus = useCallback(() => {
    if (onFocus) onFocus();
    setFocused(true);
  }, [onFocus]);

  const onWrappedBlur = useCallback(() => {
    if (onBlur) onBlur();
    setFocused(false);
  }, [onBlur]);

  return (
    <View style={[styles.container, containerStyle]}>
      <ReactNativeTextInput
        ref={innerRef}
        style={[style, { color: colors.darkBlue }]}
        keyboardAppearance={dark ? "dark" : "light"}
        {...otherProps}
        onBlur={onWrappedFocus}
        onFocus={onWrappedBlur}
        value={value}
        allowFontScaling={false}
        {...flags}
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

// $FlowFixMe https://github.com/facebook/flow/pull/5920
export default React.forwardRef((props, ref) => (
  <TextInput innerRef={ref} {...props} />
));

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    display: "flex",
    width: "100%",
  },
  clearWrapper: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
