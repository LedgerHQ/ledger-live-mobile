/* @flow */
import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import LText from "../../components/LText";
import colors from "../../colors";

export default function Scan(props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <LText secondary semiBold style={styles.textStyle}>
        {props.route.params.wcURL}
      </LText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    flex: 1,
  },
  textStyle: {
    color: "black",
  },
});
