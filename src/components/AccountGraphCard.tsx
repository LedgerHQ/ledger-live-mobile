import React, { useState, useCallback, useMemo, ReactNode } from "react";
import { useTheme } from "styled-components/native";
import { useTranslation } from "react-i18next";
import { Unit, Currency, AccountLike } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
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
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { counterValueFormatter } from "../screens/Market/utils";
import { useLocale } from "../context/Locale";

import { ensureContrast } from "../colors";
import getWindowDimensions from "../logic/getWindowDimensions";
import { useTimeRange } from "../actions/settings";
import Delta from "./Delta";
import FormatDate from "./FormatDate";
import Pills from "./Pills";
import CurrencyUnitValue from "./CurrencyUnitValue";
import Placeholder from "./Placeholder";
import { Item } from "./Graph/types";
import CurrencyRate from "./CurrencyRate";
import Chart from "./chart";
import { discreetModeSelector } from "../reducers/settings";
import { useSelector } from "react-redux";
import { useBalanceHistoryWithCountervalue } from "../actions/portfolio";
import ChartCard from "./chart/ChartCard";

type HeaderProps = {
  account: AccountLike;
  isAvailable: boolean;
  history: BalanceHistoryWithCountervalue;
  unit: Unit;
  counterValueCurrency: Currency;
  useCounterValue?: boolean;
  countervalueChange: ValueChange;
};

const Header = ({
  account,
  isAvailable,
  history,
  unit,
  counterValueCurrency,
  useCounterValue,
  countervalueChange,
}: HeaderProps) => (
  <GraphCardHeader
    account={account}
    isLoading={!isAvailable}
    to={history[history.length - 1]}
    cryptoCurrencyUnit={unit}
    counterValueUnit={counterValueCurrency.units[0]}
    useCounterValue={useCounterValue}
    valueChange={countervalueChange}
  />
);

type FooterProps = {
  renderAccountSummary: () => ReactNode;
};

const Footer = ({ renderAccountSummary }: FooterProps) => {
  const accountSummary = renderAccountSummary && renderAccountSummary();
  return (
    <Box>
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
};

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
  const [rangeRequest, setRangeRequest] = useState("24h");
  const [timeRange, setTimeRange, timeRangeItems] = useTimeRange();
  const { countervalueChange } = useBalanceHistoryWithCountervalue({
    account,
    range: timeRange,
  });
  const [timeRangeMapped] = useState({
    "24h": "day",
    "7d": "week",
    "30d": "month",
    "1y": "year",
  });

  const isAvailable = !useCounterValue || countervalueAvailable;

  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const graphColor = ensureContrast(
    getCurrencyColor(currency),
    colors.neutral.c30,
  );

  const refreshChart = useCallback(
    request => {
      if (request && request.range && timeRangeMapped[request.range]) {
        const { range } = request;
        setTimeRange(timeRangeMapped[range]);
        setRangeRequest(range);
      }
    },
    [timeRangeMapped, setTimeRange, setRangeRequest],
  );

  const dataFormatted = useMemo(
    () =>
      history
        ? history.map(d => ({
            date: d.date,
            value: d.countervalue / 100,
          }))
        : [],
    [history],
  );

  return (
    <ChartCard
      Header={
        <Header
          account={account}
          isAvailable={isAvailable}
          history={history}
          unit={unit}
          counterValueCurrency={counterValueCurrency}
          useCounterValue={useCounterValue}
          countervalueChange={countervalueChange}
        />
      }
      Footer={<Footer renderAccountSummary={renderAccountSummary} />}
      range={rangeRequest}
      loading={false}
      loadingChart={!dataFormatted}
      refreshChart={refreshChart}
      chartData={dataFormatted}
      currencyColor={graphColor}
    />
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
