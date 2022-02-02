import React, { useState, useCallback, ReactNode } from "react";
import { useTheme } from "@react-navigation/native";
import { Unit, Currency, AccountLike } from "@ledgerhq/live-common/lib/types";
import {
  getAccountCurrency,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import { getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import {
  ValueChange,
  PortfolioRange,
  BalanceHistoryWithCountervalue,
} from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { Box, Flex, Text } from "@ledgerhq/native-ui";

import { ensureContrast } from "../colors";
import getWindowDimensions from "../logic/getWindowDimensions";
import { useTimeRange } from "../actions/settings";
import Delta from "./Delta";
import FormatDate from "./FormatDate";
import Graph from "./Graph";
import Pills from "./Pills";
import CurrencyUnitValue from "./CurrencyUnitValue";
import Placeholder from "./Placeholder";
import { Item } from "./Graph/types";
import CurrencyRate from "./CurrencyRate";

type Props = {
  account: AccountLike;
  range: PortfolioRange;
  history: BalanceHistoryWithCountervalue;
  valueChange: ValueChange;
  countervalueAvailable: boolean;
  counterValueCurrency: Currency;
  useCounterValue?: boolean;
  renderAccountSummary: () => ReactNode;
};

export default function AccountGraphCard({
  account,
  countervalueAvailable,
  history,
  range,
  counterValueCurrency,
  useCounterValue,
  valueChange,
  renderAccountSummary,
}: Props) {
  const { colors } = useTheme();
  const [hoveredItem, setHoverItem] = useState<Item | undefined>();
  const [, setTimeRange, timeRangeItems] = useTimeRange();
  const mapCryptoValue = useCallback(d => d.value || 0, []);
  const mapCounterValue = useCallback(
    d => (d.countervalue ? d.countervalue : 0),
    [],
  );

  const isAvailable = !useCounterValue || countervalueAvailable;

  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const graphColor = ensureContrast(
    getCurrencyColor(currency),
    colors.background,
  );

  const accountSummary = renderAccountSummary && renderAccountSummary();

  return (
    <Box padding={6} borderRadius={2} bg={"neutral.c30"}>
      <GraphCardHeader
        account={account}
        isLoading={!isAvailable}
        to={history[history.length - 1]}
        hoveredItem={hoveredItem}
        cryptoCurrencyUnit={unit}
        counterValueUnit={counterValueCurrency.units[0]}
        useCounterValue={useCounterValue}
        valueChange={valueChange}
      />
      <Graph
        isInteractive={isAvailable}
        isLoading={!isAvailable}
        height={100}
        width={getWindowDimensions().width - 64}
        color={isAvailable ? graphColor : colors.grey}
        data={history}
        onItemHover={setHoverItem}
        mapValue={useCounterValue ? mapCounterValue : mapCryptoValue}
      />
      <Box marginTop={6}>
        <Pills
          isDisabled={!isAvailable}
          value={range}
          onChange={setTimeRange}
          items={timeRangeItems}
        />
      </Box>
      {accountSummary && (
        <Box
          flexDirection={"row"}
          alignItemps={"center"}
          marginTop={5}
          overflow={"hidden"}
        >
          {accountSummary}
        </Box>
      )}
    </Box>
  );
}

function GraphCardHeader({
  counterValueUnit,
  to,
  hoveredItem,
  isLoading,
  valueChange,
  account,
}: {
  account: AccountLike;
  isLoading: boolean;
  cryptoCurrencyUnit: Unit;
  counterValueUnit: Unit;
  to: Item;
  hoveredItem?: Item;
  useCounterValue?: boolean;
  valueChange: ValueChange;
}) {
  const currency = getAccountCurrency(account);
  const item = hoveredItem || to;

  return (
    <Flex
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Box flexShrink={1}>
        {hoveredItem ? (
          <Text
            variant={"body"}
            fontWeight={"semiBold"}
            color="neutral.c100"
            numberOfLines={1}
            mr={4}
          >
            <CurrencyUnitValue
              unit={counterValueUnit}
              value={item.countervalue}
            />
          </Text>
        ) : (
          <CurrencyRate currency={currency} />
        )}
      </Box>
      <Box>
        {isLoading ? (
          <Placeholder
            width={50}
            containerHeight={19}
            style={{ marginRight: 10 }}
          />
        ) : hoveredItem && hoveredItem.date ? (
          <Text variant={"body"} fontWeight={"medium"}>
            <FormatDate date={hoveredItem.date} />
          </Text>
        ) : valueChange ? (
          <Delta percent valueChange={valueChange} />
        ) : null}
      </Box>
    </Flex>
  );
}
