// @flow
import { bridge } from "./engine";

beforeAll(async () => {
  await device.launchApp();
  bridge.init();
});

afterAll(() => {
  bridge.close();
});
