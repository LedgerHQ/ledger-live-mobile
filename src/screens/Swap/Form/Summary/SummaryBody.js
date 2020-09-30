// @flow
import React from "react";
import { StyleSheet, View } from "react-native";
import { Trans } from "react-i18next";
import type { TransactionStatus } from "@ledgerhq/live-common/lib/types";
import {
  getMainAccount,
  getAccountName,
  getAccountUnit,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account/helpers";
import type {
  Exchange,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/swap/types";
import LText from "../../../../components/LText";
import CurrencyUnitValue from "../../../../components/CurrencyUnitValue";
import SectionSeparator, {
  ArrowDownCircle,
} from "../../../../components/SectionSeparator";
import CurrencyIcon from "../../../../components/CurrencyIcon";
import colors from "../../../../colors";

const SummaryBody = ({
  status,
  exchange,
  exchangeRate,
}: {
  status: TransactionStatus,
  exchange: Exchange,
  exchangeRate: ExchangeRate,
}) => {
  const { fromAccount, fromParentAccount, toAccount } = exchange;
  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const { magnitudeAwareRate } = exchangeRate;
  const { amount, estimatedFees } = status;
  return (
    <>
      <View style={styles.row}>
        <LText primary style={styles.label}>
          <Trans i18nKey="transfer.swap.form.summary.from" />
        </LText>
        <View style={styles.accountNameWrapper}>
          <CurrencyIcon size={16} currency={fromCurrency} />
          <LText semiBold style={styles.value}>
            {getAccountName(fromAccount)}
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
            unit={getAccountUnit(fromAccount)}
            value={amount}
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
            {getAccountName(toAccount)}
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
            value={amount.times(magnitudeAwareRate)}
          />
        </LText>
      </View>
      <View style={styles.rate}>
        <View style={styles.row}>
          <LText primary style={styles.label}>
            <Trans i18nKey="transfer.swap.form.summary.provider" />
          </LText>
          <LText style={[styles.value3, styles.capitalize]}>
            {exchangeRate.provider}
          </LText>
        </View>
        <View style={styles.row}>
          <LText primary style={styles.label}>
            <Trans i18nKey="transfer.swap.form.summary.fees" />
          </LText>
          <LText tertiary style={styles.value3}>
            <CurrencyUnitValue
              showCode
              unit={getAccountUnit(
                getMainAccount(fromAccount, fromParentAccount),
              )}
              value={estimatedFees}
            />
          </LText>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  capitalize: {
    textTransform: "capitalize",
  },
});

export default SummaryBody;
