// @flow

import React from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import LText from "../../../components/LText";
import type { SwapRouteParams } from ".";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import Button from "../../../components/Button";
import SectionSeparator, {
  ArrowDownCircle,
} from "../../../components/SectionSeparator";
import CurrencyIcon from "../../../components/CurrencyIcon";
import colors from "../../../colors";

type Props = {
  navigation: any,
  route: {
    params: SwapRouteParams,
  },
};

const SwapFormSummary = ({ navigation, route }: Props) => {
  const { exchange, exchangeRate, target } = route.params;
  const { fromAccount, fromCurrency, toCurrency, toAccount } = exchange;
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <LText primary style={styles.label}>
          <Trans i18nKey="transfer.swap.form.summary.from" />
        </LText>
        <View style={styles.accountNameWrapper}>
          <CurrencyIcon size={16} currency={fromCurrency} />
          <LText semiBold style={styles.value}>
            {fromAccount.name}
          </LText>
        </View>
      </View>
      <View style={styles.row}>
        <LText primary style={styles.label}>
          <Trans i18nKey="transfer.swap.form.summary.send" />
        </LText>
        <LText tertiary style={styles.value2}>
          <CurrencyUnitValue
            showCode
            unit={getAccountUnit(toAccount)}
            value={fromAccount.balance}
          />
        </LText>
      </View>
      <View style={styles.separator}>
        <SectionSeparator noMargin>
          <ArrowDownCircle big />
        </SectionSeparator>
      </View>
      <View style={styles.row}>
        <LText primary style={styles.label}>
          <Trans i18nKey="transfer.swap.form.summary.to" />
        </LText>
        <View style={styles.accountNameWrapper}>
          <CurrencyIcon size={16} currency={toCurrency} />
          <LText semiBold style={styles.value}>
            {toAccount.name}
          </LText>
        </View>
      </View>
      <View style={styles.row}>
        <LText primary style={styles.label}>
          <Trans i18nKey="transfer.swap.form.summary.receive" />
        </LText>
        <LText tertiary style={styles.value2}>
          <CurrencyUnitValue
            showCode
            unit={getAccountUnit(toAccount)}
            value={toAccount.balance}
          />
        </LText>
      </View>
      <View style={styles.rate}>
        <View style={styles.row}>
          <LText primary style={styles.label}>
            <Trans i18nKey="transfer.swap.form.summary.provider" />
          </LText>
          <LText style={styles.value3}>{exchangeRate.provider}</LText>
        </View>
        <View style={styles.row}>
          <LText primary style={styles.label}>
            <Trans i18nKey="transfer.swap.form.summary.fees" />
          </LText>
          <LText tertiary style={styles.value3}>
            {exchangeRate.rate}
          </LText>
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          event="SwapSummaryConfirm"
          type={"primary"}
          title={<Trans i18nKey="transfer.swap.form.button" />}
          onPress={() => {}}
          containerStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    backgroundColor: colors.white,
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 12,
  },
  separator: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.smoke,
  },
  accountNameWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 14,
    lineHeight: 19,
    marginLeft: 8,
  },
  value2: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
  },
  value3: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
  rate: {
    marginTop: 30,
    borderRadius: 4,
    backgroundColor: colors.lightFog,
    padding: 16,
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    width: "100%",
  },
});

export default SwapFormSummary;
