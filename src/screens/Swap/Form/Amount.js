// @flow
import React, { useCallback, useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import { View, StyleSheet } from "react-native";
import { Trans } from "react-i18next";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account/helpers";
import { NotEnoughBalance } from "@ledgerhq/errors";
import { getExchangeRates } from "@ledgerhq/live-common/lib/swap";
import type { SwapRouteParams } from ".";
import LText from "../../../components/LText";
import SectionSeparator from "../../../components/SectionSeparator";
import CurrencyInput from "../../../components/CurrencyInput";
import CurrencyUnitValue from "../../../components/CurrencyUnitValue";
import TranslatedError from "../../../components/TranslatedError";
import Button from "../../../components/Button";
import colors from "../../../colors";
import { ScreenName } from "../../../const";

type Props = {
  navigation: any,
  route: {
    params: SwapRouteParams,
  },
};

const SwapFormAmount = ({ navigation, route }: Props) => {
  const { exchange, target } = route.params;
  const { fromAccount, toAccount } = exchange;
  const fromUnit = getAccountUnit(fromAccount);
  const toUnit = getAccountUnit(toAccount);
  const warning = null;
  const [amount, setAmount] = useState(BigNumber(0));
  const [error, setError] = useState(null);
  const [rate, setRate] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function getRates() {
      try {
        const rates = await getExchangeRates({
          ...exchange,
          fromAmount: amount,
        });
        if (ignore) return;
        setError(null);
        setRate(rates[0]); // TODO when we have more rates, what?
      } catch (error) {
        if (ignore) return;
        setError(error);
      }
    }
    if (!ignore && amount.gt(0) && !amount.isNaN()) {
      if (amount.gt(fromAccount.balance)) {
        // TODO use available balance instead
        setError(new NotEnoughBalance());
      } else {
        getRates();
      }
    }

    return () => {
      ignore = true;
    };
  }, [exchange, fromAccount, toAccount, amount]);

  const onContinue = useCallback(() => {
    navigation.navigate(ScreenName.SwapSummary, {
      ...route.params,
      exchange: {
        ...exchange,
        fromAmount: amount,
      },
      exchangeRate: rate,
    });
  }, [amount, exchange, navigation, rate, route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <CurrencyInput
          editable={true}
          isActive={true}
          // onFocus={this.onCryptoFieldFocus}
          onChange={setAmount}
          unit={fromUnit}
          value={amount}
          renderRight={
            <LText style={[styles.currency, styles.active]} tertiary>
              {fromUnit.code}
            </LText>
          }
          hasError={!!error}
        />
        <LText
          style={[error ? styles.error : styles.warning]}
          numberOfLines={2}
        >
          <TranslatedError error={error || warning} />
        </LText>
      </View>
      <SectionSeparator />
      <View style={styles.wrapper}>
        <CurrencyInput
          isActive={false}
          unit={toUnit}
          value={rate ? amount.times(rate.magnitudeAwareRate) : null}
          placeholder={"0"}
          editable={false}
          showAllDigits
          renderRight={
            <LText style={styles.currency} tertiary>
              {toUnit.code}
            </LText>
          }
        />
      </View>
      <View style={styles.bottomWrapper}>
        <View style={styles.available}>
          <View style={styles.availableLeft}>
            <LText>
              <Trans i18nKey="send.amount.available" />
            </LText>
            <LText tertiary style={styles.availableAmount}>
              <CurrencyUnitValue
                showCode
                unit={fromUnit}
                value={fromAccount.balance}
              />
            </LText>
          </View>
        </View>
        <View style={styles.continueWrapper}>
          <Button
            event="SwapAmountContinue"
            type="primary"
            disabled={!!error || amount.eq(0) || !rate}
            title={<Trans i18nKey={"common.continue"} />}
            onPress={onContinue}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  wrapper: {
    flexBasis: 100,
    flexShrink: 0.5,
    flexDirection: "column",
    justifyContent: "center",
  },
  currency: {
    fontSize: 24,
    color: colors.grey,
  },
  active: {
    fontSize: 32,
  },
  error: {
    color: colors.alert,
    fontSize: 14,
  },
  warning: {
    color: colors.orange,
    fontSize: 14,
  },
  availableAmount: {
    color: colors.darkBlue,
  },
  availableRight: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  availableLeft: {
    justifyContent: "center",
    flexGrow: 1,
  },
  maxLabel: {
    marginRight: 4,
  },
  bottomWrapper: {
    flex: 1,
    alignSelf: "stretch",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  continueWrapper: {
    alignSelf: "stretch",
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonRight: {
    marginLeft: 8,
  },
  amountWrapper: {
    flex: 1,
  },
  switch: {
    opacity: 0.99,
  },
  available: {
    flexDirection: "row",
    display: "flex",
    fontSize: 16,
    color: colors.grey,
    marginBottom: 16,
  },
});

export default SwapFormAmount;
