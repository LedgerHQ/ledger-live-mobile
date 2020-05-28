// @flow
import type { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type {
  Account,
  Transaction,
  Unit,
} from "@ledgerhq/live-common/lib/types";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { mapDelegationInfo } from "@ledgerhq/live-common/lib/families/cosmos/utils";
import LText from "../../components/LText";
import { DataRowUnitValue } from "../../components/ValidateOnDeviceDataRow";
import colors from "../../colors";

export default {
  pre: Pre,
  fees: Fees,
  disableFees: () => true,
};

function Pre({
  account,
  transaction,
}: {
  account: Account,
  transaction: Transaction,
}) {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  const { t } = useTranslation();

  const unit = getAccountUnit(account);
  const { validators } = useCosmosPreloadData();

  switch (transaction.mode) {
    case "delegate": {
      const mappedDelegations = mapDelegationInfo(
        transaction.validators,
        validators,
        unit,
      );

      return (
        <View style={styles.listWrapper}>
          <View style={styles.row}>
            <LText style={styles.greyText}>{t("ValidateOnDevice.name")}</LText>
            <LText style={styles.greyText}>
              {t("ValidateOnDevice.amount")}
            </LText>
          </View>

          {mappedDelegations.map(
            ({ validator, address, formattedAmount }, i) => (
              <View
                style={[
                  styles.row,
                  i === mappedDelegations.length - 1
                    ? styles.rowLast
                    : undefined,
                ]}
              >
                <LText
                  semiBold
                  numberOfText={1}
                  style={[styles.text, styles.biggerText]}
                >
                  {validator?.name ?? address}
                </LText>

                <LText semiBold style={[styles.text, styles.biggerText]}>
                  {formattedAmount}
                </LText>
              </View>
            ),
          )}
        </View>
      );
    }
    default:
      return null;
  }
}

function Fees({
  transaction,
  mainAccountUnit,
  estimatedFees,
}: {
  transaction: Transaction,
  mainAccountUnit: Unit,
  estimatedFees: BigNumber,
}) {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  const { t } = useTranslation();

  switch (transaction.mode) {
    case "send":
    case "delegate":
      return null;
    default:
      return (
        <DataRowUnitValue
          label={t("send.validation.fees")}
          unit={mainAccountUnit}
          value={estimatedFees}
        />
      );
  }
}

const styles = StyleSheet.create({
  text: {
    color: colors.darkBlue,
  },
  greyText: {
    color: colors.grey,
  },
  biggerText: {
    fontSize: 16,
  },
  listWrapper: {
    paddingHorizontal: 16,
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.lightFog,
    paddingVertical: 16,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
});
