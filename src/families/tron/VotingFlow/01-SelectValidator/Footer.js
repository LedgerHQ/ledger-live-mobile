// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import { translate } from "react-i18next";
import type { TFunction } from "react-i18next";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import Button from "../../../../components/Button";
import LText from "../../../../components/LText";
import colors from "../../../../colors";

type Props = {
  t: TFunction,
  bridgePending: boolean,
  onContinue: () => void,
  status: any,
  transaction: Transaction,
};

function SelectValidatorFooter({
  t,
  bridgePending,
  onContinue,
  status,
  transaction,
}: Props) {
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

export default translate()(SelectValidatorFooter);
