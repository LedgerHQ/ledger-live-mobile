// @flow
// TODO: Move to live-common

import { getSwapSelectableCurrencies } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import { useEffect, useReducer } from "react";
import { getProvider, getProviders, getProvidersByName } from "./logic";
import type { SwapProvidersProps, SwapProviders } from "./types";

export function useSwapProviders({
  disabledProviders,
  setCurrencies,
}: SwapProvidersProps): SwapProviders {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function setup() {
      const providers = await getProviders();
      const filtered = getProvidersByName(providers, disabledProviders);
      const provider = getProvider(providers, filtered);

      if (provider) {
        setCurrencies(getSwapSelectableCurrencies([provider]));

        dispatch({ type: "setProviders", payload: [filtered] });
        dispatch({ type: "setProvider", payload: provider });
        return;
      }
      dispatch({ type: "setProviders", payload: [] });
    }

    setup();
  }, [disabledProviders, setCurrencies]);

  return state;
}

const initialState = {
  providers: undefined,
  provider: undefined,
};

function reducer(state, action) {
  switch (action.type) {
    case "setProvider":
      return {
        ...state,
        provider: action.payload,
      };
    case "setProviders":
      return {
        ...state,
        providers: action.payload,
      };
    default:
      return state;
  }
}
