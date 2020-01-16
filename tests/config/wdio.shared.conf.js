exports.config = {
  // ====================
  // Runner and framework
  // Configuration
  // ====================
  runner: "local",
  framework: "mocha",
  jasmineNodeOpts: {
    // Updated the timeout to 30 seconds due to possible longer appium calls
    // When using XPATH
    defaultTimeoutInterval: 90000,
  },
  sync: true,
  logLevel: "info",
  deprecationWarnings: true,
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  reporters: ["spec"],

  // ====================
  // Appium Configuration
  // ====================
  services: ["appium"],
  appium: {
    // For options see
    // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
    args: {
      // For arguments see
      // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
    },
    command: "./node_modules/.bin/appium",
  },

  port: 4723,

  // ====================
  // Some hooks
  // ====================
  beforeSession: (config, capabilities, specs) => {
    require("@babel/register");
  },
};
