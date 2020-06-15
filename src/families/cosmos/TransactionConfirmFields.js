// @flow
import invariant from "invariant";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { Account } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/cosmos/types";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { mapDelegationInfo } from "@ledgerhq/live-common/lib/families/cosmos/logic";
import LText from "../../components/LText";
import { DataRow } from "../../components/ValidateOnDeviceDataRow";
import colors from "../../colors";
import Info from "../../icons/Info";

type FieldProps = {
  account: Account,
  transaction: Transaction,
  field: {
    type: string,
    label: string,
  },
};

function CosmosDelegateValidatorsField({ account, transaction }: FieldProps) {
  const { t } = useTranslation();

  const unit = getAccountUnit(account);
  const { validators } = useCosmosPreloadData();
  const mappedDelegations = mapDelegationInfo(
    transaction.validators,
    validators,
    unit,
  );

  return (
    <View style={styles.listWrapper}>
      <View style={styles.row}>
        <LText style={styles.greyText}>{t("ValidateOnDevice.name")}</LText>
        <LText style={styles.greyText}>{t("ValidateOnDevice.amount")}</LText>
      </View>

      {mappedDelegations.map(({ validator, address, formattedAmount }, i) => (
        <View
          key={address}
          style={[
            styles.row,
            i === mappedDelegations.length - 1 ? styles.rowLast : undefined,
          ]}
        >
          <LText
            semiBold
            numberOfText={1}
            style={[styles.text, styles.biggerText, styles.labelText]}
          >
            {validator?.name ?? address}
          </LText>

          <LText semiBold style={[styles.text, styles.biggerText]}>
            {formattedAmount}
          </LText>
        </View>
      ))}
    </View>
  );
}

function CosmosValidatorNameField({ field, transaction: tx }: FieldProps) {
  const { validators } = useCosmosPreloadData();
  const validator = validators.find(
    v => v.validatorAddress === tx.validators[0].address,
  );

  return (
    <CosmosStringField
      label={field.label}
      value={validator?.name ?? tx.validators[0].address}
    />
  );
}

function CosmosSourceValidatorNameField({
  field,
  transaction: { cosmosSourceValidator },
}: FieldProps) {
  const { validators } = useCosmosPreloadData();
  if (!cosmosSourceValidator) {
    return null;
  }
  const validator = validators.find(
    v => v.validatorAddress === cosmosSourceValidator,
  );

  return (
    <CosmosStringField
      label={field.label}
      value={validator?.name ?? cosmosSourceValidator}
    />
  );
}

function CosmosStringField({ label, value }: { label: string, value: string }) {
  return (
    <DataRow label={label}>
      <LText semiBold style={styles.text} numberOfLines={1}>
        {value}
      </LText>
    </DataRow>
  );
}

function Warning({ transaction }: FieldProps) {
  invariant(transaction.family === "cosmos", "cosmos transaction");

  const { t } = useTranslation();

  switch (transaction.mode) {
    case "send":
      return transaction.memo ? (
        <DataRow label={t("ValidateOnDevice.memo")}>
          <LText semiBold style={styles.text}>
            {transaction.memo}
          </LText>
        </DataRow>
      ) : null;
    case "redelegate":
    case "claimReward":
    case "undelegate":
      return (
        <DataRow>
          <Info size={22} color={colors.live} />
          <LText
            semiBold
            style={[styles.text, styles.infoText]}
            numberOfLines={3}
          >
            {t(`ValidateOnDevice.infoWording.cosmos.${transaction.mode}`)}
          </LText>
        </DataRow>
      );
    default:
      return null;
  }
}

const fieldComponents = {
  "cosmos.delegateValidators": CosmosDelegateValidatorsField,
  "cosmos.validatorName": CosmosValidatorNameField,
  "cosmos.sourceValidatorName": CosmosSourceValidatorNameField,
};

export default {
  fieldComponents,
  warning: Warning,
};

const styles = StyleSheet.create({
  text: {
    color: colors.darkBlue,
    textAlign: "right",
    flex: 1,
  },
  labelText: {
    textAlign: "left",
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
