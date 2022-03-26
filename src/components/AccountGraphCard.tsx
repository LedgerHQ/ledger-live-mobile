import React, { useState, useCallback, useMemo, ReactNode, memo } from "react";
import { useTheme } from "styled-components/native";
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
import { Box, Flex, Text, ChartCard } from "@ledgerhq/native-ui";

import { useTranslation } from "react-i18next";
import { rangeDataTable } from "@ledgerhq/live-common/lib/market/utils/rangeDataTable";
import { useSelector } from "react-redux";
import { ensureContrast } from "../colors";
import { useTimeRange } from "../actions/settings";
import Delta from "./Delta";
import FormatDate from "./FormatDate";
import CurrencyUnitValue from "./CurrencyUnitValue";
import Placeholder from "./Placeholder";
import { Item } from "./Graph/types";
import CurrencyRate from "./CurrencyRate";
import { useBalanceHistoryWithCountervalue } from "../actions/portfolio";
import { counterValueFormatter } from "../screens/Market/utils";
import { localeSelector } from "../reducers/settings";

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
  return accountSummary ? (
    <Box
      flexDirection={"row"}
      alignItemps={"center"}
      marginTop={5}
      overflow={"hidden"}
    >
      {accountSummary}
    </Box>
  ) : null;
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

const timeRangeMapped: any = {
  "24h": "day",
  "7d": "week",
  "30d": "month",
  "1y": "year",
};

function AccountGraphCard({
  account,
  countervalueAvailable,
  history,
  counterValueCurrency,
  useCounterValue,
  renderAccountSummary,
}: Props) {
  const { colors } = useTheme();
  const locale = useSelector(localeSelector);
  const { t } = useTranslation();

  const [rangeRequest, setRangeRequest] = useState("24h");
  const [timeRange, setTimeRange] = useTimeRange();
  const { countervalueChange } = useBalanceHistoryWithCountervalue({
    account,
    range: timeRange,
  });

  const ranges = useMemo(
    () =>
      Object.keys(rangeDataTable)
        .filter(key => key !== "1h")
        .map(r => ({ label: t(`market.range.${r}`), value: r })),
    [t],
  );

  const timeFormat = useMemo(() => {
    switch (rangeRequest) {
      case "24h":
        return { hour: "numeric", minute: "numeric" };
      case "7d":
        return { weekday: "short" };
      case "30d":
        return { month: "short", day: "numeric" };
      default:
        return { month: "short" };
    }
  }, [rangeRequest]);

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
    [setTimeRange, setRangeRequest],
  );

  const dataFormatted = useMemo(() => {
    const counterValueCurrencyMagnitude =
      10 ** counterValueCurrency.units[0].magnitude || 1;
    return history?.length
      ? history.map(d => ({
          date: d.date,
          value: d.countervalue / counterValueCurrencyMagnitude || 0,
        }))
      : [];
  }, [history, counterValueCurrency]);

  const xAxisFormatter = useCallback(
    (timestamp: number) =>
      new Intl.DateTimeFormat(locale, timeFormat).format(timestamp),
    [locale, timeFormat],
  );

  const yAxisFormatter = useCallback(
    (value: number) =>
      value
        ? counterValueFormatter({
            value,
            shorten: true,
            locale,
            allowZeroValue: true,
            t,
          })
        : 0,
    [locale, t],
  );

  const valueFormmater = useCallback(
    (value: number) =>
      value
        ? counterValueFormatter({
            value,
            currency: counterValueCurrency.ticker,
            locale,
            allowZeroValue: true,
            t,
          })
        : 0,
    [counterValueCurrency.ticker, locale, t],
  );

  return (
    <ChartCard
      locale={locale}
      ranges={ranges}
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
      refreshChart={refreshChart}
      chartData={dataFormatted}
      currencyColor={graphColor}
      xAxisFormatter={xAxisFormatter}
      yAxisFormatter={yAxisFormatter}
      valueFormatter={valueFormmater}
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

export default memo(AccountGraphCard);
