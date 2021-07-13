import { useEffect, useState, useCallback } from "react";
import { start } from "./segment";

const HookAnalytics = ({ store, user }: { store: *, user: * }) => {
  const [analyticsStarted, setAnalyticsStarted] = useState(false);

  const sync = useCallback(() => {
    if (analyticsStarted) return;
    setAnalyticsStarted(true);
    start(store, user);
  }, [analyticsStarted, store, user]);

  useEffect(sync, [sync]);

  return null;
};

export default HookAnalytics;
