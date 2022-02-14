// @flow
import { device } from "detox";
import { bridge } from "./engine";

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
