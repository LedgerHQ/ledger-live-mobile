// @flow
import { useEffect } from "react";
import { AppState } from "react-native";
import { useAnnouncements } from "@ledgerhq/live-common/lib/announcements/react";

const POLLING_TIME = 60000;

export default function NotificationsPolling() {
  const { updateCache } = useAnnouncements();

  useEffect(() => {
    updateCache();
    let polling = setInterval(updateCache, POLLING_TIME);
    const appStateHandler = nextAppState => {
      if (polling) clearInterval(polling);
      if (nextAppState === "active") {
        polling = setInterval(updateCache, POLLING_TIME);
      }
    };

    AppState.addEventListener("change", appStateHandler);

    return () => {
      if (polling) clearInterval(polling);
      AppState.removeEventListener("change", appStateHandler);
    };
  }, [updateCache]);

  return null;
}
