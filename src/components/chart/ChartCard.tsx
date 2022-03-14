/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React, { useCallback, useMemo, useEffect } from "react";
import { useTheme } from "styled-components/native";
import { Flex, GraphTabs, InfiniteLoader } from "@ledgerhq/native-ui";
import { rangeDataTable } from "@ledgerhq/live-common/lib/market/utils/rangeDataTable";
import * as Animatable from "react-native-animatable";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import Chart from ".";

const indexes: [string, number][] = [
  ["d", 1],
  ["K", 1000],
  ["M", 1000000],
  ["B", 1000000000],
  ["T", 1000000000000],
  ["Q", 1000000000000000],
  ["Qn", 1000000000000000000],
];

const formatters: any = {};

export const counterValueFormatter = ({
  currency,
  value,
  shorten,
  locale,
  t,
  allowZeroValue = false,
}: {
  currency?: string;
  value: number;
  shorten?: boolean;
  locale: string;
  t?: TFunction;
  allowZeroValue?: boolean;
}): string => {
  if (!value && !allowZeroValue) {
    return "-";
  }

  if (!formatters[locale]) formatters[locale] = {};
  if (!formatters[locale]?.[currency]) {
    formatters[locale][currency] = new Intl.NumberFormat(locale, {
      style: currency ? "currency" : "decimal",
      currency,
      maximumFractionDigits: 8,
      maximumSignificantDigits: 8,
    });
  }

  const formatter = formatters[locale][currency];

  if (shorten && t) {
    const sign = value > 0 ? "" : "-";
    const v = Math.abs(value);
    const index = Math.floor(Math.log(v + 1) / Math.log(10) / 3);

    const [i, n] = indexes[index];

    const roundedValue = Math.floor((v / n) * 1000) / 1000;

    const number = formatter.format(roundedValue);

    const I = t(`numberCompactNotation.${i}`);

    const formattedNumber = number.replace(/([0-9,. ]+)/, `${sign}$1 ${I} `);

    return formattedNumber;
  }

  return formatter.format(value);
};

export default function ChartCard({
  Header,
  Footer,
  range,
  isLoading,
  refreshChart,
  chartData,
  currencyColor,
  counterCurrencyTicker,
  margin = 0,
  locale,
}: {
  Header: React.ReactNode;
  Footer: React.ReactNode;
  range: string;
  isLoading?: boolean;
  refreshChart: (request: any) => void;
  chartData: any;
  currencyColor: string;
  counterCurrencyTicker: string;
  margin: number;
  locale: string;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const ranges = Object.keys(rangeDataTable)
    .filter(key => key !== "1h")
    .map(r => ({ label: t(`market.range.${r}`), value: r }));

  const rangesLabels = ranges.map(({ label }) => label);

  const activeRangeIndex = ranges.findIndex(r => r.value === range);

  const setRange = useCallback(
    index => {
      if (isLoading) return;
      const newRange = ranges[index]?.value;
      if (range !== newRange) refreshChart({ range: newRange });
    },
    [isLoading, range, ranges, refreshChart],
  );

  const timeFormat = useMemo(() => {
    switch (ranges[activeRangeIndex].value) {
      case "24h":
        return { hour: "numeric", minute: "numeric" };
      case "7d":
        return { weekday: "short" };
      case "30d":
        return { month: "short", day: "numeric" };
      default:
        return { month: "short" };
    }
  }, [ranges, activeRangeIndex]);

  return (
    <Flex margin={margin} padding={6} borderRadius={2} bg={"neutral.c30"}>
      {Header}
      <Flex mt={6} height={100} alignItems="center" justifyContent="center">
        {chartData && chartData.length > 0 ? (
          <Animatable.View animation="fadeIn" duration={400} useNativeDriver>
            <Chart
              locale={locale}
              data={chartData}
              backgroundColor={colors.neutral.c30}
              color={currencyColor}
              timeFormat={timeFormat}
              valueKey={"value"}
              yAxisFormatter={value =>
                counterValueFormatter({
                  value,
                  shorten: true,
                  locale,
                  allowZeroValue: true,
                  t,
                })
              }
              valueFormatter={value =>
                counterValueFormatter({
                  value,
                  currency: counterCurrencyTicker,
                  locale,
                  allowZeroValue: true,
                  t,
                })
              }
            />
          </Animatable.View>
        ) : (
          <InfiniteLoader size={32} />
        )}
      </Flex>
      <Flex mt={70}>
        <GraphTabs
          activeIndex={activeRangeIndex}
          activeBg="neutral.c30"
          onChange={setRange}
          labels={rangesLabels}
        />
      </Flex>
      {Footer}
    </Flex>
  );
}
