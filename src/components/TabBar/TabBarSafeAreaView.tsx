import React from "react";
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from "react-native-safe-area-context";

const TabBarSafeAreaView = ({
  style,
  ...otherProps
}: NativeSafeAreaViewProps) => <SafeAreaView style={[style]} {...otherProps} />;

export default TabBarSafeAreaView;
