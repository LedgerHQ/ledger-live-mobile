// @flow
import React, { useCallback, useState } from "react";
import { BigNumber } from "bignumber.js";
import { StyleSheet, View, TouchableOpacity, Linking } from "react-native";
import { Trans } from "react-i18next";
import type { TransactionStatus } from "@ledgerhq/live-common/lib/types";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import {
  getAccountName,
  getAccountUnit,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account/helpers";
import type {
  Exchange,
  ExchangeRate,
} from "@ledgerhq/live-common/lib/exchange/swap/types";
import { useTheme } from "@react-navigation/native";
import LText from "../../../../components/LText";
import CurrencyUnitValue from "../../../../components/CurrencyUnitValue";
import InfoModal from "../../../../components/InfoModal";
import SectionSeparator, {
  ArrowDownCircle,
} from "../../../../components/SectionSeparator";
import CurrencyIcon from "../../../../components/CurrencyIcon";
import ExternalLink from "../../../../icons/ExternalLink";

import { urls } from "../../../../config/urls";

const SummaryBody = ({
  status,
  exchange,
  exchangeRate,
}: {
  status: TransactionStatus,
  exchange: Exchange,
  exchangeRate: ExchangeRate,
}) => {
  const { colors } = useTheme();
  const { fromAccount, toAccount } = exchange;
  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const { magnitudeAwareRate, payoutNetworkFees } = exchangeRate;
  const { amount } = status;
  const [payoutFeesDrawerVisibility, setPayoutFeesDrawerVisibility] = useState(
    false,
  );
  const openProvider = useCallback(() => {
    Linking.openURL(urls.swap.providers[exchangeRate.provider].main);
  }, [exchangeRate.provider]);

  return (
    <>
      <View style={styles.row}>
        <LText primary style={styles.label} color="smoke">
          <Trans i18nKey="transfer.swap.form.summary.from" />
        </LText>
        <View style={styles.accountNameWrapper}>
          <CurrencyIcon size={16} currency={fromCurrency} />
          <LText
            numberOfLines={1}
            ellipsizeMode="middle"
            semiBold
            style={styles.value}
          >
            {getAccountName(fromAccount)}
          </LText>
        </View>
      </View>
      <View style={styles.row}>
        <LText primary style={styles.label} color="smoke">
          <Trans i18nKey="transfer.swap.form.summary.send" />
        </LText>
        <LText tertiary style={styles.value2}>
          <CurrencyUnitValue
            disableRounding
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
        <LText primary style={styles.label} color="smoke">
          <Trans i18nKey="transfer.swap.form.summary.to" />
        </LText>
        <View style={styles.accountNameWrapper}>
          <CurrencyIcon size={16} currency={toCurrency} />
          <LText
            numberOfLines={1}
            ellipsizeMode="middle"
            semiBold
            style={styles.value}
          >
            {getAccountName(toAccount)}
          </LText>
        </View>
      </View>
      <View style={styles.row}>
        <LText primary style={styles.label} color="smoke">
          <Trans
            i18nKey={
              exchangeRate.tradeMethod === "fixed"
                ? "transfer.swap.form.summary.receive"
                : "transfer.swap.form.summary.receiveFloat"
            }
          />
        </LText>
        <LText tertiary style={styles.value2}>
          <CurrencyUnitValue
            disableRounding
            showCode
            unit={getAccountUnit(toAccount)}
            value={amount.times(magnitudeAwareRate)}
          />
        </LText>
      </View>
      {exchangeRate.tradeMethod === "float" ? (
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setPayoutFeesDrawerVisibility(true)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <LText
              style={{ ...styles.label, flex: 0, marginRight: 4 }}
              color="smoke"
            >
              <Trans i18nKey="transfer.swap.form.summary.payoutNetworkFees" />
            </LText>
            <Icon size={13} color={colors.smoke} name={"info-circle"} />
          </TouchableOpacity>
          <LText tertiary style={styles.value2}>
            <CurrencyUnitValue
              disableRounding
              showCode
              unit={getAccountUnit(toAccount)}
              value={BigNumber(payoutNetworkFees || 0)}
            />
          </LText>
        </View>
      ) : null}
      <View style={[styles.rate, { backgroundColor: colors.lightFog }]}>
        <View style={[styles.row, { marginBottom: 0 }]}>
          <LText primary style={styles.label} color="smoke">
            <Trans i18nKey="transfer.swap.form.summary.provider" />
          </LText>
          <TouchableOpacity
            style={styles.providerLinkContainer}
            onPress={openProvider}
          >
            <LText semiBold style={styles.providerLink} color="live">
              {exchangeRate.provider}
            </LText>
            <ExternalLink size={11} color={colors.live} />
          </TouchableOpacity>
        </View>
        <View style={[styles.row, { marginBottom: 0 }]}>
          <LText primary style={styles.label} color="smoke">
            <Trans i18nKey="transfer.swap.form.summary.method" />
          </LText>
          <LText semiBold style={styles.providerLink}>
            <Trans
              i18nKey={`transfer.swap.tradeMethod.${exchangeRate.tradeMethod}`}
            />
          </LText>
        </View>
      </View>
      <InfoModal
        isOpened={payoutFeesDrawerVisibility}
        title={<Trans i18nKey={"transfer.swap.payoutModal.title"} />}
        desc={<Trans i18nKey={"transfer.swap.payoutModal.description"} />}
        confirmLabel={<Trans i18nKey={"transfer.swap.payoutModal.cta"} />}
        onClose={() => setPayoutFeesDrawerVisibility(false)}
      />
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
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  labelTooltip: {
    fontSize: 12,
    lineHeight: 18,
  },
  accountNameWrapper: {
    flex: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
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
    padding: 16,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  providerLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  providerLink: {
    textTransform: "capitalize",
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
    marginRight: 6,
  },
});

export default SummaryBody;
