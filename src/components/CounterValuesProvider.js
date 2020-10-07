// @flow
import React, { useState, useEffect, useMemo, useRef } from "react";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import {
  Countervalues,
  useCountervaluesState,
  useCountervaluesPolling,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { inferTrackingPairForAccounts } from "@ledgerhq/live-common/lib/countervalues/logic";
import { getCountervalues, saveCountervalues } from "../db";
import { accountsSelector } from "../reducers/accounts";
import { counterValueCurrencySelector } from "../reducers/settings";

export default function CountervaluesProvider({
  children,
}: {
  children: React$Node,
}) {
  const trackingPairs = useTrackingPairs();
  const [initialCountervalues, setInitialCuntervalues] = useState();

  useEffect(() => {
    async function getInitialCountervalues() {
      const values = await getCountervalues();
      setInitialCuntervalues(values);
    }
    getInitialCountervalues();
  }, []);

  return (
    <Countervalues
      initialCountervalues={initialCountervalues}
      userSettings={{ trackingPairs, autofillGaps: true }}
    >
      <CountervaluesManager>{children}</CountervaluesManager>
    </Countervalues>
  );
}

function CountervaluesManager({ children }: { children: React$Node }) {
  useCacheManager();
  usePollingManager();

  return children;
}

function useCacheManager() {
  const state = useCountervaluesState();
  useEffect(() => {
    saveCountervalues(state);
  }, [state]);
}

function usePollingManager() {
  const { start, stop } = useCountervaluesPolling();
  const appState = useRef(AppState.currentState ?? "");
  const { isInternetReachable } = useNetInfo();
  const [isActive, setIsActive] = useState(!!appState.current);

  useEffect(() => {
    function handleChange(nextAppState) {
      setIsActive(
        appState.current.match(/inactive|background/) &&
          nextAppState === "active",
      );

      appState.current = nextAppState;
    }

    AppState.addEventListener("change", handleChange);

    return () => {
      AppState.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!isInternetReachable || !isActive) {
      stop();
      return;
    }
    start();
  }, [isInternetReachable, isActive, start, stop]);
}

export function useTrackingPairs() {
  const accounts = useSelector(accountsSelector);
  const countervalue = useSelector(counterValueCurrencySelector);
  return useMemo(() => inferTrackingPairForAccounts(accounts, countervalue), [
    accounts,
    countervalue,
  ]);
}
