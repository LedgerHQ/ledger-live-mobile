// @flow
import React, { useState, useEffect, useMemo, useRef } from "react";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import {
  Countervalues,
  useCountervaluesPolling,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { inferTrackingPairForAccounts } from "@ledgerhq/live-common/lib/countervalues/logic";
import { getCountervalues } from "../db";
import { accountsSelector } from "../reducers/accounts";
import { counterValueCurrencySelector } from "../reducers/settings";

export default function CountervaluesProvider({
  children,
}: {
  children: React$Node,
}) {
  const userSettings = useUserSettings();
  const [savedState, setSavedState] = useState();

  useEffect(() => {
    async function getSavedState() {
      const values = await getCountervalues();
      setSavedState(values);
    }
    getSavedState();
  }, []);

  return (
    <Countervalues userSettings={userSettings} savedState={savedState}>
      <CountervaluesManager>{children}</CountervaluesManager>
    </Countervalues>
  );
}

function CountervaluesManager({ children }: { children: React$Node }) {
  usePollingManager();

  return children;
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

export function useUserSettings() {
  const accounts = useSelector(accountsSelector);
  const countervalue = useSelector(counterValueCurrencySelector);
  return useMemo(
    () => ({
      trackingPairs: inferTrackingPairForAccounts(accounts, countervalue),
      autofillGaps: true,
    }),
    [accounts, countervalue],
  );
}
