// @flow
import React, { useState } from "react";

import type { SwapDataType } from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import type {
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import type {
  Account,
  TokenAccount,
} from "@ledgerhq/live-common/lib/types/account";

export const SwapDataContext = React.createContext<SwapDataParams>({
  swapData: undefined,
  setSwapData: () => {},
});

export type SwapDataParams = {
  swapData?: {
    swap: SwapDataType,
    setFromAccount?: (account?: Account | TokenAccount) => void,
    setToAccount?: (account?: Account | TokenAccount) => void,
    setCurrency?: (currency?: TokenCurrency | CryptoCurrency) => void,
  },
  setSwapData: (data: {
    swap: SwapDataType,
    setFromAccount?: (account?: Account | TokenAccount) => void,
    setToAccount?: (account?: Account | TokenAccount) => void,
    setCurrency?: (currency?: TokenCurrency | CryptoCurrency) => void,
  }) => void,
};

export default function SwapDataProvider({
  children,
}: {
  children: React$Node,
}) {
  const [swapData, setSwapData] = useState(undefined);

  return (
    <SwapDataContext.Provider value={{ swapData, setSwapData }}>
      {children}
    </SwapDataContext.Provider>
  );
}
