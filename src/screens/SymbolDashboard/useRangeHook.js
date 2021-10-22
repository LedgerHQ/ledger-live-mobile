// @flow

import { useEffect, useState } from "react";

export type RangeData = {
  days: number | string,
  interval: string,
  simple: string,
  scale: string,
};

const dataTable: { [key: string]: RangeData } = {
  "1Y": {
    days: 365,
    interval: "daily",
    simple: "1y",
    scale: "year",
  },
  "1M": {
    days: 30,
    interval: "daily",
    simple: "30d",
    scale: "month",
  },
  "1W": {
    days: 7,
    interval: "hourly",
    simple: "7d",
    scale: "week",
  },
  "1D": {
    days: 1,
    interval: "hourly",
    simple: "24h",
    scale: "day",
  },
  "1H": {
    days: 0.04,
    interval: "minutely",
    simple: "1h",
    scale: "minute",
  },
  All: {
    days: "max",
    interval: "yearly",
    simple: "1y",
    scale: "year",
  },
};

export const useRange = (range: string = "1D") => {
  useEffect(() => {
    setRangeData(dataTable[range]);
  }, [range]);

  const [rangeData, setRangeData] = useState<RangeData>(dataTable[range]);

  return {
    rangeData,
    setRangeData,
  };
};
