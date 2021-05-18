// @flow
import { useMemo } from "react";
import { useTheme } from "@react-navigation/native";
import Color from "color";

import ParaswapIcon from "../../icons/swap/Paraswap";

const useManifests = () => {
  const theme = useTheme();

  return useMemo(() => {
    const paraswapUrl = new URL(`http://localhost:3000/app/dapp-browser`);
    paraswapUrl.searchParams.set(
      "url",
      "https://paraswap-ui-ledger.herokuapp.com/?embed=true&referer=ledger",
    );
    // TODO: uncomment me after ledger.js is updated
    // paraswapUrl.searchParams.set("nanoApp", "Paraswap");
    paraswapUrl.searchParams.set("dappName", "paraswap");
    paraswapUrl.searchParams.set(
      "backgroundColor",
      new Color(theme.colors.background).hex(),
    );
    paraswapUrl.searchParams.set(
      "textColor",
      new Color(theme.colors.text).hex(),
    );

    const manifests = {
      debug: {
        url: new URL(
          `https://iframe-dapp-browser-test.vercel.app/app/debug?t=1`,
        ),
        name: "Debugger",
      },
      paraswap: {
        name: "ParaSwap",
        url: paraswapUrl,
        // $FlowFixMe
        icon: ParaswapIcon,
      },
    };

    return manifests;
  }, [theme]);
};

export default useManifests;
