import React, { useEffect, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components/native";
import moment from "moment";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryArea,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";

import { Flex } from "@ledgerhq/native-ui";
import type { Item } from "./types";

import Color from "color";
export const hex = (color: string): string => Color(color).hex().toString();

const Container = styled(Flex)`
`;

const sortByDate = (a: Item, b: Item): -1 | 0 | 1 => {
  if (a.date.getTime() < b.date.getTime()) return -1;
  if (a.date.getTime() > b.date.getTime()) return 1;
  return 0;
};

export type ChartProps = {
  data: Array<Item>;
  backgroundColor: string;
  color: string;
  /*
   ** This prop is used to format the x-axis using time options from moment format
   ** See https://momentjs.com/docs/#/displaying/format/
   */
  tickFormat?: string;
  /* This prop is used to override the key that store the data */
  valueKey?: string;
  height?: number;
  yAxisFormatter: (n: number) => string,
  valueFormatter: (n: number) => string,
  disableTooltips: boolean,
};

const Chart = ({
  data,
  backgroundColor,
  color,
  tickFormat = "MMM",
  valueKey = "value",
  height = 200,
  yAxisFormatter,
  valueFormatter,
  disableTooltips = false,
}: ChartProps): JSX.Element => {
  const theme = useTheme();
  const sortData = useMemo(() => data.sort(sortByDate), [data]);
  const [counterValues, setCounterValues] = useState(data.map(d => d[valueKey]));
  useEffect(() => {
    setCounterValues(data.map(d => d[valueKey]));
  }, [data]);

  return (
    <Container justifyContent="center" alignItems="center">
      <VictoryChart
        scale={{ x: "time" }}
        height={height}
        domainPadding={{ y: 5 }}
        padding={{ top: 30, left: 60, right: 35, bottom: 35 }}
        maxDomain={{ y: Math.max(...counterValues) * 1.2 }}
        minDomain={{ y: Math.min(...counterValues) * 0.8 }}
        containerComponent={
          <VictoryVoronoiContainer
            disable={disableTooltips}
            voronoiBlacklist={['victory-area']}
            labels={({ datum }) => {
              const valueFormatted = valueFormatter(datum.countervalue);
              return valueFormatted === "-" ? "0" : valueFormatted;
            }}
            labelComponent={
              <VictoryTooltip
                centerOffset={{ y: -10 }}
                renderInPortal={false}
                constrainToVisibleArea
                style={{
                  fill: color,
                }}
                flyoutPadding={7}
                flyoutStyle={{
                  fill: backgroundColor,
                  stroke: color,
                }}
              />
            }
          />
        }
      >
        {/* y-axis */}
        <VictoryAxis
          dependentAxis
          crossAxis
          tickFormat={price => yAxisFormatter(price)}
          style={{
            grid: {
              stroke: theme.colors.neutral.c40,
              strokeDasharray: "4 4",
            },
            axisLabel: { display: "none" },
            axis: { display: "none" },
            ticks: { display: "none" },
            tickLabels: {
              fill: theme.colors.neutral.c80,
              fontSize: 12,
            },
          }}
        />

        {/* x-axis */}
        <VictoryAxis
          crossAxis={false}
          tickFormat={timestamp => moment(timestamp).format(tickFormat)}
          style={{
            axis: {
              stroke: theme.colors.neutral.c40,
              strokeDasharray: "4 4",
            },
            tickLabels: {
              fill: theme.colors.neutral.c80,
              fontSize: 12,
            },
            grid: { display: "none" },
          }}
        />

        {/* gradient area */}
        <Defs>
          <LinearGradient id="chartGradient" x1="0.5" x2="0.5" y1="0" y2="1">
            <Stop stopColor={hex(color)} stopOpacity="0.15" />
            <Stop offset="1" stopColor={hex(theme.colors.neutral.c00)} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <VictoryArea
          name="victory-area"
          data={sortData}
          interpolation="monotoneX"
          sortKey="date"
          x="date"
          y={valueKey}
          style={{ data: { fill: `url(#chartGradient)` } }}
          standalone={false}
        />

        {/* data line */}
        <VictoryLine
          data={sortData}
          interpolation="monotoneX"
          x="date"
          y={valueKey}
          style={{ data: { stroke: color } }}
        />

        {/* Rendered point */}
        {/* <VictoryScatter
          style={{
            data: {
              stroke: color,
              strokeWidth: 3,
              fill: theme.colors.background.main,
            },
          }}
          size={5}
          data={[sortData[sortData.length - 1]]}
          x="date"
          y={valueKey}
        /> */}
      </VictoryChart>
    </Container>
  );
};

export default Chart;
