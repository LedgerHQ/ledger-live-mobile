/* @flow */
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { isEnvDefault } from "@ledgerhq/live-common/lib/env";

import { TrackScreen } from "../../../analytics";
import colors from "../../../colors";

import Disclaimer from "./Disclaimer";
import { experimentalFeatures } from "../../../experimental";
import FeatureRow from "./FeatureRow";

export default function ExperimentalSettings() {
  return (
    <ScrollView contentContainerStyle={styles.root}>
      <TrackScreen category="Settings" name="Experimental" />
      <View style={styles.container}>
        <View style={styles.disclaimerContainer}>
          <Disclaimer />
        </View>
        {experimentalFeatures.map(feat =>
          !feat.shadow || (feat.shadow && !isEnvDefault(feat.name)) ? (
            <FeatureRow key={feat.name} feature={feat} />
          ) : null,
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { paddingTop: 16, paddingBottom: 64 },
  container: {
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  disclaimerContainer: {
    paddingHorizontal: 12,
  },
});
