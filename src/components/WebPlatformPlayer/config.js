// @flow
import qs from "qs";

const DAPP_BROWSER =
  "https://iframe-dapp-browser-test.vercel.app/app/dapp-browser";

export const PlatformsConfig = {
  debug: {
    isDapp: false,
    url:
      "https://iframe-dapp-browser-test.vercel.app/app/debug?embed=true&t=3333",
    name: "Debugger",
    icon: null,
  },
  paraswap: {
    isDapp: true,
    url: DAPP_BROWSER,
    name: "ParaSwap",
    params: {
      url: "https://paraswap-ui-ledger.herokuapp.com/?embed=true",
      appName: "paraswap",
    },
    // $FlowFixMe
    icon: require("../../images/platform/paraswap.png").default,
  },
};

export const getPlatformUrl = (platform: string, t?: Number) => {
  const config = PlatformsConfig[platform];
  if (!config) {
    return null;
  }

  const url = new URL(config.isDapp ? DAPP_BROWSER : config.url);

  const params = {
    t,
    ...config.params,
  };

  Object.keys(params).forEach(k => url.searchParams.set(k, `${params[k]}`));

  return url;
};

export const getPlatformOrigin = (platform: string) => {
  const config = PlatformsConfig[platform];
  if (!config) {
    return null;
  }

  return new URL(config.url).origin;
};

export const getPlatformName = (platform: string) => {
  return PlatformsConfig[platform]?.name || null;
};
