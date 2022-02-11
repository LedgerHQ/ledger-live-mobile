exports.config = {
  // ====================
  // Runner and framework
  // Configuration
  // ====================
  runner: "local",
  framework: "mocha",
  mochaOpts: {
    timeout: 60000,
  },
  sync: true,
  logLevel: "info",
  deprecationWarnings: true,
  bail: 0,
  waitforTimeout: 100000,
  connectionRetryTimeout: 900000,
  connectionRetryCount: 5,
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
  /*  beforeSession: (config, capabilities, specs) => {
    require("@babel/register");
  },*/
};
