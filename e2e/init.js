// @flow

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  // TODO E2E: Probably need a better reloading logic
  await device.reloadReactNative();
});
