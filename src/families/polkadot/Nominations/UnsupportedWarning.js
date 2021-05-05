// @flow
import React from "react";
import { StyleSheet, Text } from "react-native";
import { Trans } from "react-i18next";

import { urls } from "../../../config/urls";

import Alert from "../../../components/Alert";

export const ExternalControllerUnsupportedWarning = ({
  address,
  onOpenExplorer,
}: {
  address: ?string,
  onOpenExplorer: Function,
}) => (
  <Alert type="help" learnMoreUrl={urls.polkadotStaking} vertical>
    <Trans
      i18nKey="polkadot.nomination.externalControllerUnsupported"
      values={{
        address: address
          ? [address.substr(0, 5), address.substr(-5)].join("...")
          : null,
      }}
    >
      <Text onPress={() => onOpenExplorer(address)} style={styles.underline} />
    </Trans>
  </Alert>
);
export const ExternalStashUnsupportedWarning = ({
  address,
  onOpenExplorer,
}: {
  address: ?string,
  onOpenExplorer: Function,
}) => (
  <Alert type="help" learnMoreUrl={urls.polkadotStaking} vertical>
    <Trans
      i18nKey="polkadot.nomination.externalStashUnsupported"
      values={{
        address: address
          ? [address.substr(0, 5), address.substr(-5)].join("...")
          : null,
      }}
    >
      <Text onPress={() => onOpenExplorer(address)} style={styles.underline} />
    </Trans>
  </Alert>
);

const styles = StyleSheet.create({
  underline: {
    fontWeight: "500",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
});
