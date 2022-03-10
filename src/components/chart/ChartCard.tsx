/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useTheme } from "styled-components/native";
import { Flex, GraphTabs, InfiniteLoader } from "@ledgerhq/native-ui";
import { rangeDataTable } from "@ledgerhq/live-common/lib/market/utils/rangeDataTable";
import * as Animatable from "react-native-animatable";
import { useTranslation } from "react-i18next";
import Chart from ".";
import { useLocale } from "../../context/Locale";
import { counterValueFormatter } from "../../screens/Market/utils";

export default function ChartCard({
  Header,
  Footer,
  range,
  isLoading,
  refreshChart,
  chartData,
  currencyColor,
  margin = 0,
}: {
  Header: React.ReactNode,
  Footer: React.ReactNode,
  range: string;
  isLoading?: boolean;
  refreshChart: (request: any) => void;
  chartData: any;
  currencyColor: string;
  margin: number;
}) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { locale } = useLocale();

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

  const [tickFormat, setTickFormat] = useState("MMM");
  useEffect(() => {
    switch (ranges[activeRangeIndex].value) {
      case "24h":
        setTickFormat("h:mm a");
        break;
      case "7d":
        setTickFormat("ddd");
        break;
      case "30d":
        setTickFormat("MMM Do");
        break;
      default:
        setTickFormat("MMM");
        break;
    }
  }, [ranges, activeRangeIndex]);

  return (
    <Flex margin={margin} padding={6} borderRadius={2} bg={"neutral.c30"}>
      {Header}
      <Flex mt={6} height={100} alignItems="center" justifyContent="center">
        {chartData && chartData.length > 0 ? (
          <Animatable.View animation="fadeIn" duration={400} useNativeDriver>
            <Chart
              data={chartData}
              backgroundColor={colors.neutral.c30}
              color={currencyColor}
              tickFormat={tickFormat}
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
                  currency: "usd", // counterValueCurrency.ticker,
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
