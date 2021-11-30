import React, { useState, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies/color";
import type { Unit } from "@ledgerhq/live-common/lib/types";
import { useSelector } from "react-redux";
import { ensureContrast } from "../../colors";
import { useTimeRangeForChart } from "../../hooks/market";
import getWindowDimensions from "../../logic/getWindowDimensions";
import Delta from "../../components/Delta";
import FormatDate from "../../components/FormatDate";
import type { Item } from "../../components/Graph/types";
import Graph from "../../components/Graph";
import Pills from "../../components/Pills";
import TransactionsPendingConfirmationWarning from "../../components/TransactionsPendingConfirmationWarning";
import LText from "../../components/LText";
import Placeholder from "../../components/Placeholder";
import { usePortfolio } from "../../actions/portfolio";
import { counterValueCurrencySelector } from "../../reducers/settings";
import { currencyFormat } from "../../helpers/currencyFormatter";

type ChartItem = {
  date: Date,
  value: number,
};
type Props = {
  chartData: Array<ChartItem>,
  loading: boolean,
  setRange: () => void,
  currency: any,
  range: { key: string, value: string, label: string },
};

export default function Chart({
  chartData,
  loading,
  setRange,
  currency,
  range,
}: Props) {
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const portfolio = usePortfolio();

  const [hoveredItem, setHoverItem] = useState();
  const [, setTimeRange, timeRangeItems] = useTimeRangeForChart();
  const { colors } = useTheme();

  const mapGraphValue = useCallback(d => d.value || 0, []);

  const isAvailable = portfolio.balanceAvailable;
  const accounts = portfolio.accounts;
  const balanceHistory = portfolio.balanceHistory;

  const setLocalTimeRange = timeRange => {
    setTimeRange(timeRange.key);
    setRange(timeRange);
  };

  const data = chartData.length ? chartData : balanceHistory;

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
        valueChange={{
          percentage: currency.market_cap_change_percentage_24h / 100,
        }}
        isLoading={loading}
        hoveredItem={hoveredItem}
        to={{ value: currency.current_price }}
        unit={counterValueCurrency.units[0]}
      />
      <Graph
        isInteractive={isAvailable}
        isLoading={loading}
        height={187}
        width={getWindowDimensions().width}
        color={isAvailable ? graphColor : colors.grey}
        data={data}
        onItemHover={setHoverItem}
        mapValue={mapGraphValue}
      />
      <View style={styles.pillsContainer}>
        <Pills
          isDisabled={!isAvailable}
          value={range.key}
          onChange={setLocalTimeRange}
          // $FlowFixMe
          items={timeRangeItems}
          testID={`Range - Selection`}
        />
      </View>
    </View>
  );
}

function GraphCardHeader({
  valueChange,
  hoveredItem,
  isLoading,
  to,
  unit,
}: {
  valueChange: ValueChange,
  isLoading: boolean,
  to: Item,
  hoveredItem: ?Item,
  unit: ?Unit,
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
                {item.value ? currencyFormat(item.value, unit.code) : ""}
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
                valueChange={valueChange}
                style={styles.deltaPercent}
                toFixed={2}
              />
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
