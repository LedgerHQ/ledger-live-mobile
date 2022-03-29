const detox = require("detox");

async function globalTeardown() {
  console.log("==============> STARTING GLOBAL TEARDOWN");
  await detox.globalCleanup();
}

module.exports = globalTeardown;
