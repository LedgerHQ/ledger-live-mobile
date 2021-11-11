// @flow
import * as bridge from "../bridge/server";
import { $tap, $, $waitFor } from "../utils";

export function start(timeline: Timeline) {
  selectRange(timeline);
}

async function selectRange(timeline: Timeline) {
  it(`should select timeline`, async () => {
    await $tap(`Range - Selection`);
  });

  switch (timeline) {
    case "1D":
      await loadCurrencyChartData();
      break;
    default:
      break;
  }
}

async function loadCurrencyChartData() {
  bridge.loadCurrencyChartData();
  const el = $("CoinChart");
  await $waitFor(el);
}

type Timeline = "1H" | "1D" | "1W" | "1M" | "1Y" | "All";
