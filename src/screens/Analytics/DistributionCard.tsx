// @flow
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types/currencies";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";

import { useTheme } from "styled-components/native";
import { Text, Flex } from "@ledgerhq/native-ui";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import ProgressBar from "../../components/ProgressBar";
import CounterValue from "../../components/CounterValue";
import ParentCurrencyIcon from "../../components/ParentCurrencyIcon";
import { ensureContrast } from "../../colors";

export type DistributionItem = {
  currency: CryptoCurrency | TokenCurrency,
  distribution: number, // % of the total (normalized in 0-1)
  amount: number,
  countervalue: number, // countervalue of the amount that was calculated based of the rate provided
};

type Props = {
  item: DistributionItem,
};

export default function DistributionCard({
  item: { currency, amount, distribution },
}: Props) {
  const { colors } = useTheme();
  const color = useMemo(
    () => ensureContrast(getCurrencyColor(currency), colors.background.main),
    [colors, currency],
  );
  const percentage = Math.round(distribution * 1e4) / 1e2;

  return (
    <Flex style={[styles.root]}>
      <Flex flexDirection="row">
        <Flex style={styles.currencyLogo}>
          <ParentCurrencyIcon currency={currency} size={32} />
        </Flex>
        <Flex style={styles.rightContainer}>
          <Flex style={styles.currencyRow}>
            <Text variant="large" color="neutral.c100" fontWeight="semiBold">
              {currency.name}
            </Text>
            <Text variant="large" color="neutral.c100" fontWeight="semiBold">
              {`${percentage}%`}
            </Text>
          </Flex>
          {distribution ? (
            <>
              <Flex style={styles.rateRow}>
              <Text variant="body" color="neutral.c70" fontWeight="medium">
                  <CurrencyUnitValue unit={currency.units[0]} value={amount} />
                </Text>
                <Text variant="body" color="neutral.c70" fontWeight="medium">
                  <CounterValue currency={currency} value={amount} />
                </Text>
              </Flex>
            </>
          ) : null}
        </Flex>
      </Flex>
      {distribution ? (
        <Flex style={styles.distributionRow}>
          <ProgressBar progress={percentage} progressColor={color} backgroundColor={colors.neutral.c40} />
        </Flex>
      ) : null}
    </Flex>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    width: "100%",
  },
  rightContainer: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "column",
  },
  currencyLogo: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  distributionRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
});
