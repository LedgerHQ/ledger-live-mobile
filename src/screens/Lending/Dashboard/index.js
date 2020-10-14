// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTranslation } from "react-i18next";
// import { useNavigation } from "@react-navigation/native";
import colors from "../../../colors";
// import { NavigatorName } from "../../../const";
import extraStatusBarPadding from "../../../logic/extraStatusBarPadding";
import TrackScreen from "../../../analytics/TrackScreen";

const forceInset = { bottom: "always" };

export default function Dashboard() {
  const { t } = useTranslation();
  // const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[styles.root, { paddingTop: extraStatusBarPadding }]}
      forceInset={forceInset}
    >
      <TrackScreen category="Lending" />
      <View style={styles.body}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  body: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
  },
});
