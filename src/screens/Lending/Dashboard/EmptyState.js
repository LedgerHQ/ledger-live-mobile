// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import LText from "../../../components/LText";
import ExternalLink from "../../../components/ExternalLink";
import colors from "../../../colors";

const EmptyState = () => {
  return (
    <View style={styles.root}>
      <LText style={styles.title}>
        <Trans i18nKey="transfer.lending.dashboard.emptySateDescription" />
      </LText>
      <ExternalLink
        text={<Trans i18nKey="transfer.lending.howDoesLendingWork" />}
        event="Lending Support Link Click"
        onPress={() => {
          /** @TODO link to support page */
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 4,
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  title: {
    lineHeight: 19,
    fontSize: 13,
    color: colors.grey,
    textAlign: "center",
    paddingBottom: 16,
  },
});

export default EmptyState;
