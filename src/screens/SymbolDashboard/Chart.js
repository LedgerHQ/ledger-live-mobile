import React, { useState, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import type { Unit } from "@ledgerhq/live-common/lib/types";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies/color";
import { useSelector } from "react-redux";
import { ensureContrast } from "../../colors";
import { useTimeRange } from "../../actions/settings";
import getWindowDimensions from "../../logic/getWindowDimensions";
import Delta from "../../components/Delta";
import FormatDate from "../../components/FormatDate";
import type { Item } from "../../components/Graph/types";
import Graph from "../../components/Graph";
import Pills from "../../components/Pills";
import TransactionsPendingConfirmationWarning from "../../components/TransactionsPendingConfirmationWarning";
import LText from "../../components/LText";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import Placeholder from "../../components/Placeholder";
import { usePortfolio } from "../../actions/portfolio";
import { counterValueCurrencySelector } from "../../reducers/settings";

export default function Chart() {
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const portfolio = usePortfolio();

  const [hoveredItem, setHoverItem] = useState();
  const [, setTimeRange, timeRangeItems] = useTimeRange();
  const { colors } = useTheme();

  const mapGraphValue = useCallback(d => d.value || 0, []);
  const { countervalueChange } = portfolio;

  const range = portfolio.range;
  const isAvailable = portfolio.balanceAvailable;
  const accounts = portfolio.accounts;
  const balanceHistory = portfolio.balanceHistory;

  const graphColor =
    accounts.length === 1
      ? ensureContrast(
          getCurrencyColor(getAccountCurrency(accounts[0])),
          colors.background,
        )
      : "";

  return (
    <View style={styles.chartContainer}>
      <GraphCardHeader
        valueChange={countervalueChange}
        isLoading={!isAvailable}
        hoveredItem={hoveredItem}
        to={balanceHistory[balanceHistory.length - 1]}
        unit={counterValueCurrency.units[0]}
      />
      <Graph
        isInteractive={isAvailable}
        isLoading={!isAvailable}
        height={187}
        width={getWindowDimensions().width}
        color={isAvailable ? graphColor : colors.grey}
        data={balanceHistory}
        onItemHover={setHoverItem}
        mapValue={mapGraphValue}
      />
      <View style={styles.pillsContainer}>
        <Pills
          isDisabled={!isAvailable}
          value={range}
          onChange={setTimeRange}
          // $FlowFixMe
          items={timeRangeItems}
        />
      </View>
    </View>
  );
}

function GraphCardHeader({
  unit,
  hoveredItem,
  isLoading,
  to,
}: {
  isLoading: boolean,
  unit: Unit,
  to: Item,
  hoveredItem: ?Item,
}) {
  const item = hoveredItem || to;

  return (
    <View style={styles.graphHeader}>
      <View style={styles.graphHeaderBalance}>
        <View style={styles.balanceTextContainer}>
          <View style={styles.warningWrapper}>
            {isLoading ? (
              <Placeholder width={228} containerHeight={27} />
            ) : (
              <LText semiBold style={styles.balanceText}>
                <CurrencyUnitValue unit={unit} value={item.value} />
              </LText>
            )}
            <TransactionsPendingConfirmationWarning />
          </View>
        </View>
        <View style={styles.subtitleContainer}>
          {isLoading ? (
            <>
              <Placeholder
                width={50}
                containerHeight={19}
                style={{ marginRight: 10 }}
              />
              <Placeholder width={50} containerHeight={19} />
            </>
          ) : hoveredItem ? (
            <LText style={styles.delta}>
              <FormatDate date={hoveredItem.date} />
            </LText>
          ) : (
            <View style={styles.delta}>
              <Delta
                percent
                valueChange={{ percentage: 7, value: 10 }}
                style={styles.deltaPercent}
              />
              <Delta valueChange={{ percentage: -7, value: -10 }} unit={unit} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "#fff",
    paddingTop: 41,
    paddingBottom: 24,
  },
  root: {
    paddingVertical: 16,
    margin: 16,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: {
          height: 4,
        },
      },
    }),
  },
  balanceTextContainer: {
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceText: {
    fontSize: 22,
    lineHeight: 24,
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pillsContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  deltaPercent: {
    marginRight: 8,
  },
  warningWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    flexWrap: "nowrap",
  },
  graphHeaderBalance: { alignItems: "flex-start", flex: 1 },
  delta: {
    height: 24,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
