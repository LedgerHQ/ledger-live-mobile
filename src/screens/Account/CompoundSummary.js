// @flow

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account/helpers";

import type { CompoundAccountSummary } from "@ledgerhq/live-common/lib/compound/types";
import type { Account } from "@ledgerhq/live-common/lib/types";

import colors from "../../colors";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import InfoItem from "../../components/BalanceSummaryInfoItem";

type Props = {
  account: Account,
  compoundSummary: CompoundAccountSummary,
};

export default function AccountBalanceSummaryFooter({
  account,
  compoundSummary,
}: Props) {
  const { t } = useTranslation();

  const unit = getAccountUnit(account);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.root}
    >
      <InfoItem
        title={t("account.availableBalance")}
        value={
          <CurrencyUnitValue
            unit={unit}
            value={account.spendableBalance}
            disableRounding
          />
        }
      />
      <InfoItem
        title={t("account.totalSupplied")}
        value={
          <CurrencyUnitValue
            unit={unit}
            value={compoundSummary.totalSupplied}
            disableRounding
          />
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.lightFog,
    paddingTop: 16,
    overflow: "visible",
  },
});
