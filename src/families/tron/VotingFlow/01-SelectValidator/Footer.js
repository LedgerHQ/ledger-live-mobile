// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../../../components/Button";
import LText from "../../../../components/LText";
import colors from "../../../../colors";
import { useSelectValidatorContext } from "./utils";

export default function SelectValidatorFooter() {
  const {
    bridgePending,
    onContinue,
    status,
    t,
    transaction,
  } = useSelectValidatorContext();

  return (
    <View style={styles.wrapper}>
      <View style={styles.remainingWrapper}>
        <LText style={styles.remainingText}>
          {t("tron.voting.flow.selectValidator.footer.remaining")}{" "}
          <LText semiBold style={styles.remainingCount}>
            {DEFAULT_REPRESENTATIVES_COUNT - (transaction.votes || []).length}
          </LText>
        </LText>
      </View>

      <View style={styles.continueWrapper}>
        <Button
          event="SelectValidatorContinue"
          type="primary"
          title={t("common.continue")}
          onPress={onContinue}
          disabled={!!status.errors.amount || bridgePending}
          pending={bridgePending}
        />
      </View>
    </View>
  );
}

const DEFAULT_REPRESENTATIVES_COUNT = 5;

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
  remainingWrapper: {
    marginBottom: 16,
  },
  remainingText: {
    color: colors.grey,
  },
  remainingCount: {
    color: colors.darkBlue,
  },
});
