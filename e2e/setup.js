// @flow
import { device } from "detox";
import * as bridge from "./bridge/server";

beforeAll(async () => {
  bridge.init();
  return device.launchApp({
    delete: true,
    launchArgs: {
      detoxURLBlacklistRegex: ".*://explorers.api.live.ledger.com/.*",
    },
  });
});

afterAll(() => {
  bridge.close();
});
