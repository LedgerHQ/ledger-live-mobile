// @flow
import { useEffect } from "react";
import { AppState } from "react-native";
import { useLedgerStatus } from "@ledgerhq/live-common/lib/announcements/status/react";

const POLLING_TIME = 60000;

export default function LedgerStatusPolling() {
  const { updateData } = useLedgerStatus();

  useEffect(() => {
    updateData();
    let polling = setInterval(updateData, POLLING_TIME);
    const appStateHandler = nextAppState => {
      if (polling) clearInterval(polling);
      if (nextAppState === "active") {
        polling = setInterval(updateData, POLLING_TIME);
      }
    };

    AppState.addEventListener("change", appStateHandler);

    return () => {
      if (polling) clearInterval(polling);
      AppState.removeEventListener("change", appStateHandler);
    };
  }, [updateData]);

  return null;
}
