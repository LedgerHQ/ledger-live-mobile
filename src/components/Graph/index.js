// @flow

// TODO
// - render something else for non countervalues available case

import React, { memo } from "react";
import * as d3shape from "d3-shape";
import * as d3scale from "d3-scale";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import Svg, { Path, Defs } from "react-native-svg";
import { useTheme } from "@react-navigation/native";
import DefGraph from "./DefGrad";
import BarInteraction from "./BarInteraction";
import type { Item, ItemArray } from "./types";

type Props = {
  width: number,
  height: number,
  data?: ItemArray,
  color: string,
  isInteractive: boolean,
  onItemHover?: (?Item) => void,
  mapValue: Item => number,
  shape?: string,
};

const STROKE_WIDTH = 2;
const FOCUS_RADIUS = 4;

function Graph({
  width,
  height,
  data = [],
  color: initialColor,
  isInteractive = false,
  shape = "curveLinear",
  mapValue,
  onItemHover,
}: Props) {
  const { colors } = useTheme();

  const color = initialColor || colors.live;

  const maxY = mapValue(maxBy(data, mapValue));
  const minY = mapValue(minBy(data, mapValue));
  const paddedMinY = minY - (maxY - minY) / 2;

  const yExtractor = d => y(mapValue(d));

  const curve = d3shape[shape];
  const x = d3scale
    .scaleTime()
    .range([0, width])
    .domain([data[0].date, data[data.length - 1].date]);

  const y = d3scale
    .scaleLinear()
    .domain([paddedMinY, maxY])
    .range([height - STROKE_WIDTH, STROKE_WIDTH + FOCUS_RADIUS]);

  const area = d3shape
    .area()
    .x(d => x(d.date))
    .y0(d => yExtractor(d))
    .y1(d => yExtractor(d) + Math.max((maxY - minY) / 2, 200))
    .curve(curve)(data);

  const line = d3shape
    .line()
    .x(d => x(d.date))
    .y(yExtractor)
    .curve(curve)(data);

  const content = (
    <Svg height={height} width={width}>
      <Defs>
        <DefGraph height={height} color={color} />
      </Defs>
      <Path d={area} fill="url(#grad)" />
      <Path d={line} stroke={color} strokeWidth={STROKE_WIDTH} fill="none" />
    </Svg>
  );

  return isInteractive ? (
    <BarInteraction
      width={width}
      height={height}
      data={data}
      color={color}
      mapValue={mapValue}
      onItemHover={onItemHover}
      x={x}
      y={y}
    >
      {content}
    </BarInteraction>
  ) : (
    content
  );
}

export default memo<Props>(Graph);
