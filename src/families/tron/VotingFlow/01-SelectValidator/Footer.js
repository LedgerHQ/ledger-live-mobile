// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { translate } from "react-i18next";
import type { TFunction } from "react-i18next";
import Button from "../../../../components/Button";

type Props = {
  t: TFunction,
  bridgePending: boolean,
  onContinue: () => void,
  status: any,
};

function SelectValidatorFooter({
  t,
  bridgePending,
  onContinue,
  status,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.continueWrapper}>
        <Button
          event="SelectValidatorContinue"
          type="primary"
          title={t(!bridgePending ? "common.continue" : "common.loading")}
          onPress={onContinue}
          disabled={!!status.errors.amount || bridgePending}
          pending={bridgePending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 16,
  },
  continueWrapper: {
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
});

export default translate()(SelectValidatorFooter);
