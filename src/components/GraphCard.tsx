import React, { useState, useCallback, ReactNode } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { Currency, Unit } from "@ledgerhq/live-common/lib/types";
import {
  Portfolio,
  ValueChange,
} from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies/color";
import { Flex, Text } from "@ledgerhq/native-ui";
import { ensureContrast } from "../colors";
import { useTimeRange } from "../actions/settings";
import getWindowDimensions from "../logic/getWindowDimensions";
import Delta from "./Delta";
import FormatDate from "./FormatDate";
import { Item } from "./Graph/types";
import Graph from "./Graph";
import Pills from "./Pills";
import TransactionsPendingConfirmationWarning from "./TransactionsPendingConfirmationWarning";
import Card from "./Card";
import LText from "./LText";
import CurrencyUnitValue from "./CurrencyUnitValue";
import Placeholder from "./Placeholder";
import DiscreetModeButton from "./DiscreetModeButton";

type Props = {
  portfolio: Portfolio;
  counterValueCurrency: Currency;
  useCounterValue?: boolean;
  renderTitle?: ({ counterValueUnit: Unit, item: Item }) => ReactNode;
};

export default function GraphCard({
  portfolio,
  renderTitle,
  counterValueCurrency,
}: Props) {
  const [hoveredItem, setHoverItem] = useState<Item | undefined>();
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
    <Flex bg="card" style={styles.root}>
      <GraphCardHeader
        valueChange={countervalueChange}
        isLoading={!isAvailable}
        hoveredItem={hoveredItem}
        to={balanceHistory[balanceHistory.length - 1]}
        unit={counterValueCurrency.units[0]}
        renderTitle={renderTitle}
      />
      {/* <Graph */}
      {/*  isInteractive={isAvailable} */}
      {/*  isLoading={!isAvailable} */}
      {/*  height={100} */}
      {/*  width={getWindowDimensions().width - 32} */}
      {/*  color={isAvailable ? graphColor : colors.grey} */}
      {/*  data={balanceHistory} */}
      {/*  onItemHover={setHoverItem} */}
      {/*  mapValue={mapGraphValue} */}
      {/* /> */}
      {/* <View style={styles.pillsContainer}> */}
      {/*  <Pills */}
      {/*    isDisabled={!isAvailable} */}
      {/*    value={range} */}
      {/*    onChange={setTimeRange} */}
      {/*    // $FlowFixMe */}
      {/*    items={timeRangeItems} */}
      {/*  /> */}
      {/* </View> */}
    </Flex>
  );
}

function GraphCardHeader({
  unit,
  valueChange,
  hoveredItem,
  renderTitle,
  isLoading,
  to,
}: {
  isLoading: boolean;
  valueChange: ValueChange;
  unit: Unit;
  to: Item;
  hoveredItem?: Item;
  renderTitle?: ({ counterValueUnit: Unit, item: Item }) => ReactNode;
}) {
  const item = to;

  return (
    <Flex>
      <Flex flexDirection={'row'} alignItems={'center'}>
        <Text
          variant={"small"}
          fontWeight={"semiBold"}
          color={"neutral.c70"}
          textTransform={"uppercase"}
        >
          Portoflio
        </Text>
        <DiscreetModeButton />
      </Flex>

      <View style={styles.warningWrapper}>
        {isLoading ? (
          <Placeholder width={228} containerHeight={27} />
        ) : renderTitle ? (
          renderTitle({ counterValueUnit: unit, item })
        ) : (
          <Text variant={"h1"} color={"neutral.c100"}>
            <CurrencyUnitValue unit={unit} value={item.value} />
          </Text>
        )}
        <TransactionsPendingConfirmationWarning />
      </View>
      <Flex flexDirection={"row"}>
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
            />
            <Delta valueChange={valueChange} unit={unit} />
          </View>
        )}
      </Flex>
    </Flex>
  );
}

const styles = StyleSheet.create({
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
