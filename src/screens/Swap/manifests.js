// @flow
import { useMemo } from "react";

import ParaswapIcon from "../../icons/swap/Paraswap";

const useManifests = () =>
  useMemo(() => {
    const paraswapUrl = new URL(
      `https://iframe-dapp-browser-test.vercel.app/app/dapp-browser`,
    );
    paraswapUrl.searchParams.set(
      "url",
      "https://paraswap-ui-ledger.herokuapp.com/?embed=true&referer=ledger",
    );
    paraswapUrl.searchParams.set("nanoApp", "Paraswap");
    paraswapUrl.searchParams.set("dappName", "paraswap");

    const manifests = {
      debug: {
        url: new URL(`https://iframe-dapp-browser-test.vercel.app/app/debug`),
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
  }, []);

export default useManifests;
