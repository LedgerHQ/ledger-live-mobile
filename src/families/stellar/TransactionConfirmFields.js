// @flow
import React from "react";
import { StyleSheet } from "react-native";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import { DataRow } from "../../components/ValidateOnDeviceDataRow";
import LText from "../../components/LText";
import colors from "../../colors";

type Props = {
  transaction: Transaction,
};

const StellarMemoField = ({ transaction }: Props) => {
  return (
    <DataRow label={deviceMemoLabels[transaction.memoType || "NO_MEMO"]}>
      <LText semiBold style={styles.text}>
        {transaction.memoValue ? `${transaction.memoValue} ` : "[none]"}
      </LText>
    </DataRow>
  );
};

const StellarNetworkField = () => {
  return (
    <DataRow label="Network">
      <LText semiBold style={styles.text}>
        {"Public"}
      </LText>
    </DataRow>
  );
};

const fieldComponents = {
  "stellar.memo": StellarMemoField,
  "stellar.network": StellarNetworkField,
};

export default {
  fieldComponents,
};

const deviceMemoLabels = {
  MEMO_TEXT: "Memo Text",
  NO_MEMO: "Memo",
  MEMO_ID: "Memo ID",
  MEMO_HASH: "Memo Hash",
  MEMO_RETURN: "Memo Return",
};

const styles = StyleSheet.create({
  text: {
    color: colors.darkBlue,
    fontSize: 14,
    flex: 1,
    textAlign: "right",
  },
});
