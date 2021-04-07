/* @flow */
import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import LText from "../../components/LText";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { useTheme } from "@react-navigation/native";
import SummaryRow from "../../screens/SendFunds/SummaryRow";
import CheckBox from "../../components/CheckBox";
import CounterValue from "../../components/CounterValue";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import {
    getAccountUnit,
    getAccountCurrency,
  } from "@ledgerhq/live-common/lib/account";

import type { Account, AccountLike, FeeStrategy } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";
import type { RouteParams } from "../../screens/SendFunds/04-Summary";

type StrategyFeeSelect = {
    amount: BigNumber,
    feeStrategy: string
};

type Props = {
    strategies: FeeStrategy[],
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  onStrategySelect: (StrategyFeeSelect) => void
  navigation: any,
  route: { params: RouteParams },
};

const CVWrapper = ({ children }: { children: * }) => (
    <LText semiBold color="grey">
      {children}
    </LText>
  );

export default function EthereumFeeRow({
  strategies,
  account,
  transaction,
  navigation,
  route,
  onStrategySelect
}: Props) {
  const { colors } = useTheme();
  const mainAccount = getMainAccount(account, undefined);
  const currency = getAccountCurrency(mainAccount);
  const unit = getAccountUnit(account);

  return (
    <>
    <View>
      <SummaryRow title={<Trans i18nKey="Fees [trad]"/>} />
      <View style={styles.container}>
            <ScrollView style={styles.container}>
            {strategies.map((s, index) => (
                <TouchableOpacity
                key={index + s.label}
                onPress={onStrategySelect}
                style={[
                    styles.feeButton,
                    {
                    borderColor: s.label === transaction.feesStrategy ? colors.live : colors.background,
                    backgroundColor: colors.lightFog
                    },
                ]}
                >
                <View style={styles.feeStrategyContainer}>
                    <View style={styles.leftBox}>
                    <CheckBox style={styles.checkbox} isChecked={s.label === transaction.feesStrategy} />
                        <LText semiBold style={styles.feeLabel}>
                            {s.label}
                        </LText>
                    </View>
                    <View style={styles.feesAmountContainer}>
                        <LText semiBold style={styles.feesAmount}>
                            <CurrencyUnitValue showCode unit={s.unit ?? unit} value={s.displayedAmount ?? s.amount} />
                        </LText>
                        <CounterValue
                            currency={currency}
                            showCode
                            value={s.displayedAmount ?? s.amount}
                            alwaysShowSign={false}
                            withPlaceholder
                            Wrapper={CVWrapper}
                            />
                    </View>
                </View>
                </TouchableOpacity>
            ))}
            </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  leftBox: {
      flex:1,
      flexDirection: "row",
      alignItems: "center"
  },
  feeStrategyContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  feesAmountContainer: {
      alignItems: "flex-end"
  },
  feeButton: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    marginVertical: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  feeLabel: { fontSize: 16, textTransform: "capitalize", marginLeft: 10 },
  feesAmount: { fontSize: 15 },
  checkbox: { 
      borderRadius: 24, 
      width: 20, 
      height: 20
    },
});
