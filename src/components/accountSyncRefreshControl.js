// @flow

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RefreshControl } from "react-native";
import type { BehaviorAction } from "../bridge/BridgeSyncContext";
import { accountSyncStateSelector } from "../reducers/bridgeSync";
import { BridgeSyncContext } from "../bridge/BridgeSyncContext";
import CounterValues from "../countervalues";
import { SYNC_DELAY } from "../constants";

interface Props {
  error: ?Error;
  isError: boolean;
  accountId: string;
  forwardedRef?: any;
  provideSyncRefreshControlBehavior?: BehaviorAction;
}

export default (ScrollListLike: any) => {
  function Inner({
    accountId,
    error,
    isError,
    forwardedRef,
    ...scrollListLikeProps
  }: Props) {
    const setSyncBehavior = useContext(BridgeSyncContext);
    const { poll: cvPoll } = useContext(CounterValues.PollingContext);
    const { pending: isPending } = useSelector(state =>
      accountSyncStateSelector(state, { accountId }),
    );

    const [lastClickTime, setLastClickTime] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    function onPress() {
      cvPoll();
      setSyncBehavior({
        type: "SYNC_ONE_ACCOUNT",
        accountId,
        priority: 10,
      });
      setLastClickTime(Date.now());
      setRefreshing(true);
    }

    useEffect(() => {
      if (!refreshing) {
        return () => {};
      }

      const timer = setTimeout(() => {
        setRefreshing(false);
      }, SYNC_DELAY);

      return () => {
        clearTimeout(timer);
      };
    }, [refreshing]);

    const isUserClick = useMemo(() => Date.now() - lastClickTime < 1000, [
      lastClickTime,
    ]);
    const isLoading = useMemo(() => (isPending && isUserClick) || refreshing, [
      isPending,
      isUserClick,
      refreshing,
    ]);

    return (
      <ScrollListLike
        {...scrollListLikeProps}
        ref={forwardedRef}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onPress} />
        }
      />
    );
  }

  return React.forwardRef((prop, ref) => (
    <Inner {...prop} forwardedRef={ref} />
  ));
};
