// @flow

import React, { useContext, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { BridgeSyncContext } from "../bridge/BridgeSyncContext";
import CounterValues from "../countervalues";
import { SYNC_DELAY } from "../constants";

interface Props {
  error?: Error;
  isError: boolean;
  forwardedRef?: any;
}

export default (ScrollListLike: any) => {
  function Inner({ forwardedRef, ...scrollListLikeProps }: Props) {
    const [refreshing, setRefreshing] = useState(false);
    const setSyncBehavior = useContext(BridgeSyncContext);
    const { poll: cvPoll } = useContext(CounterValues.PollingContext);

    function onRefresh() {
      cvPoll();
      setSyncBehavior({
        type: "SYNC_ALL_ACCOUNTS",
        priority: 5,
      });
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

    return (
      <ScrollListLike
        {...scrollListLikeProps}
        ref={forwardedRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  }

  return React.forwardRef((props, ref) => (
    <Inner {...props} forwardedRef={ref} />
  ));
};
