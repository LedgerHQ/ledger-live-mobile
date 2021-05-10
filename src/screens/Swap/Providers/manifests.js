// @flow

export default {
  debug: {
    name: "debugger",
    url: new URL(
      `https://iframe-dapp-browser-test.vercel.app/app/debug?t=3333`,
    ),
  },
  paraswap: {
    name: "paraswap",
    url: new URL(
      `https://iframe-dapp-browser-test.vercel.app/app/dapp-browser?url=${encodeURIComponent(
        "https://paraswap-ui-ledger.herokuapp.com/?embed=true",
      )}`,
    ),
  },
};
