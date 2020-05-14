const { join } = require("path");
const { config } = require("./wdio.shared.conf");

// ============
// Specs
// ============
config.specs = ["./tests/specs/**/*.spec.js"];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
  {
    // The defaults you need to have in your config
    platformName: "iOS",
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // This is `appium:` for all Appium Capabilities which can be found here
    // http://appium.io/docs/en/writing-running-appium/caps/
    "appium:deviceName": "iPhone Simulator",
    "appium:platformVersion": "13.4",
    "appium:orientation": "PORTRAIT",
    // `automationName` will be mandatory, see
    // https://github.com/appium/appium/releases/tag/v1.13.0
    "appium:automationName": "XCUITest",
    // The path to the app
    "appium:app": join(
      process.cwd(),
      "ios/build/ledgerlivemobile/Build/Products/Staging-iphonesimulator/ledgerlivemobile.app",
    ),
    // Read the reset strategies very well, they differ per platform, see
    // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
    "appium:noReset": false,
    "appium:newCommandTimeout": 240,
  },
];

exports.config = config;
