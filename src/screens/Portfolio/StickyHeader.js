// @flow

import React from "react";
import { useSelector } from "react-redux";
import type { Portfolio, Currency } from "@ledgerhq/live-common/lib/types";
import AnimatedTopBar from "./AnimatedTopBar";
import { isUpToDateSelector } from "../../reducers/accounts";
import { globalSyncStateSelector } from "../../reducers/bridgeSync";
import { networkErrorSelector } from "../../reducers/appstate";

interface Props {
  portfolio: Portfolio;
  counterValueCurrency: Currency;
  scrollY: *;
}

export default function StickyHeader({
  scrollY,
  counterValueCurrency,
  portfolio,
}: Props) {
  const networkError = useSelector(networkErrorSelector);
  const globalSyncState = useSelector(globalSyncStateSelector);
  const isUpToDate = useSelector(isUpToDateSelector);
  return (
    <AnimatedTopBar
      scrollY={scrollY}
      portfolio={portfolio}
      counterValueCurrency={counterValueCurrency}
      pending={globalSyncState.pending && !isUpToDate}
      error={
        isUpToDate || !globalSyncState.error
          ? null
          : networkError || globalSyncState.error
      }
    />
  );
}
