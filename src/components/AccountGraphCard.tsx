import React, { useState, useCallback, useEffect, ReactNode } from "react";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
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
import { counterValueFormatter } from "../screens/Market/utils";
import { useLocale } from "../context/Locale";

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
import Chart from "./chart";
import { discreetModeSelector } from "../reducers/settings";
import { useSelector } from "react-redux";
import { useBalanceHistoryWithCountervalue } from "../actions/portfolio";

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
  const { t } = useTranslation();
  const discreet = useSelector(discreetModeSelector);
  const [timeRange, setTimeRange, timeRangeItems] = useTimeRange();
  const { countervalueChange } = useBalanceHistoryWithCountervalue({ account, range: timeRange });

  const isAvailable = !useCounterValue || countervalueAvailable;

  const { locale } = useLocale();
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const graphColor = ensureContrast(
    getCurrencyColor(currency),
    colors.neutral.c30,
  );

  const accountSummary = renderAccountSummary && renderAccountSummary();

  const [tickFormat, setTickFormat] = useState("MMM");
  useEffect(() => {
    switch (timeRange) {
      case "day":
        setTickFormat("h:mm a");
        break;
      case "week":
        setTickFormat("ddd");
        break;
      case "month":
        setTickFormat("MMM Do");
        break;
      default:
        setTickFormat("MMM");
        break;
    }
  }, [timeRange]);

  return (
    <Box padding={6} borderRadius={2} bg={"neutral.c30"}>
      <GraphCardHeader
        account={account}
        isLoading={!isAvailable}
        to={history[history.length - 1]}
        cryptoCurrencyUnit={unit}
        counterValueUnit={counterValueCurrency.units[0]}
        useCounterValue={useCounterValue}
        valueChange={countervalueChange}
      />
      <Chart
        data={history}
        backgroundColor={colors.neutral.c30}
        color={isAvailable ? graphColor : colors.neutral.c70}
        tickFormat={tickFormat}
        valueKey={"countervalue"}
        disableTooltips={discreet}
        yAxisFormatter={counterValue =>
          counterValueFormatter({
            value: counterValue / 100,
            shorten: true,
            locale,
            allowZeroValue: true,
            t,
          })
        }
        valueFormatter={counterValue =>
          counterValueFormatter({
            value: counterValue / 100,
            currency: counterValueCurrency.ticker,
            locale,
            allowZeroValue: true,
            t,
          })
        }
      />
      <Box>
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
