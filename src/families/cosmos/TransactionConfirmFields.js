// @flow
import type { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback } from "react";
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
import {
  DataRow,
  DataRowUnitValue,
} from "../../components/ValidateOnDeviceDataRow";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import colors from "../../colors";
import Info from "../../icons/Info";

export default {
  disableFees: () => true,
  pre: Pre,
  fees: Fees,
  post: Post,
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
  const mappedDelegations = mapDelegationInfo(
    transaction.validators,
    validators,
    unit,
  );

  switch (transaction.mode) {
    case "delegate": {
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
    case "redelegate":
      return (
        <>
          <DataRow label={t("ValidateOnDevice.account")}>
            <LText semiBold style={styles.text}>
              {account.freshAddress}
            </LText>
          </DataRow>

          <DataRow label={t("ValidateOnDevice.from")}>
            <LText semiBold style={styles.text}>
              {transaction.cosmosSourceValidator}
            </LText>
          </DataRow>

          <DataRow label={t("ValidateOnDevice.to")}>
            <LText semiBold style={styles.text}>
              {transaction.validators[0].address}
            </LText>
          </DataRow>

          <DataRow label={t("ValidateOnDevice.redelegationAmount")}>
            <LText semiBold style={[styles.text, styles.valueTextForLongKey]}>
              {mappedDelegations[0].formattedAmount}
            </LText>
          </DataRow>

          <DataRow label={t("ValidateOnDevice.gas")}>
            <LText semiBold style={styles.text}>
              <CurrencyUnitValue
                unit={unit}
                value={transaction.fees}
                disableRounding
              />
            </LText>
          </DataRow>
        </>
      );
    case "claimRewards":
      return (
        <>
          <DataRow label={t("ValidateOnDevice.address")}>
            <LText semiBold style={styles.text}>
              {account.freshAddress}
            </LText>
          </DataRow>

          <DataRow label={t("ValidateOnDevice.validatorAddress")}>
            <LText semiBold style={styles.text}>
              {mappedDelegations[0].address}
            </LText>
          </DataRow>

          <DataRow label={t("ValidateOnDevice.rewardAmount")}>
            <LText semiBold style={styles.text}>
              {mappedDelegations[0].formattedAmount}
            </LText>
          </DataRow>
        </>
      );
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
    case "redelegate":
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

function Post({ transaction }: { transaction: Transaction }) {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  const { t } = useTranslation();

  switch (transaction.mode) {
    case "redelegate":
    case "claimRewards":
      return (
        <DataRow>
          <Info size={22} color={colors.live} />
          <LText
            semiBold
            style={[styles.text, styles.infoText]}
            numberOfLines={3}
          >
            {t(`ValidateOnDevice.infoWording.${transaction.mode}`)}
          </LText>
        </DataRow>
      );
    default:
      null;
  }
}

const styles = StyleSheet.create({
  text: {
    color: colors.darkBlue,
    textAlign: "right",
    flex: 1,
  },
  valueTextForLongKey: {
    flex: 0.5,
  },
  greyText: {
    color: colors.grey,
  },
  biggerText: {
    fontSize: 16,
  },
  infoText: {
    color: colors.live,
    textAlign: "left",
    marginLeft: 8,
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
