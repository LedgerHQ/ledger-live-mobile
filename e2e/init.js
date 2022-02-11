// @flow
import { bridge } from "./engine";

// jest beforeAll - not detox specific
beforeAll(async () => {
  bridge.init();
});

afterAll(() => {
  bridge.close();
});
