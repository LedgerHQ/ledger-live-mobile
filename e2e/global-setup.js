const detox = require("detox");

async function globalSetup() {
  //   console.log(`===============> env: ${process.env.TZ}`);
  //   console.log("==============> STARTING GLOBAL SETUP");`
  // process.env.TZ = "UTC";
  await detox.globalInit();
  console.log(`===============> env: ${process.env.TZ}`);
}

module.exports = globalSetup;
