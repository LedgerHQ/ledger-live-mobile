const detox = require("detox");

async function globalSetup() {
  console.log("==============> STARTING GLOBAL SETUP");
  await detox.globalInit();
}

module.exports = globalSetup;
