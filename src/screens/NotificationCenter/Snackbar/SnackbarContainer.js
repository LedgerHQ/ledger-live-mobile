// @flow
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";

import {
  useAnnouncements,
  useNewAnnouncements,
} from "@ledgerhq/live-common/lib/announcements/react";
import {
  useLedgerStatus,
  useNewLedgerStatus,
} from "@ledgerhq/live-common/lib/announcements/status/react";
import type { AnnouncementContextType } from "@ledgerhq/live-common/lib/announcements/react";
import type { StatusContextType } from "@ledgerhq/live-common/lib/announcements/status/react";
import Snackbar from "./Snackbar";
import * as RootNavigation from "../../../rootnavigation.js";
import { NavigatorName, ScreenName } from "../../../const";

type Props = {
  announcements: AnnouncementContextType,
  status: StatusContextType,
};

function SnackbarContainerComponent({ announcements, status }: Props) {
  const [
    newAnnouncements,
    clearAnnouncement,
    clearAllAnnouncements,
  ] = useNewAnnouncements(announcements);
  const [
    newStatusMessages,
    clearStatusMessage,
    clearAllStatusmessages,
  ] = useNewLedgerStatus(status);

  const navigateToNotificationCenter = useCallback(() => {
    clearAllAnnouncements();
    clearAllStatusmessages();
    RootNavigation.navigate(NavigatorName.NotificationCenter, {
      screen: ScreenName.NotificationCenterNews,
    });
  }, [clearAllAnnouncements, clearAllStatusmessages]);

  const navigateToStatusPage = useCallback(() => {
    clearAllAnnouncements();
    clearAllStatusmessages();
    RootNavigation.navigate(NavigatorName.NotificationCenter, {
      screen: ScreenName.NotificationCenterStatus,
    });
  }, [clearAllAnnouncements, clearAllStatusmessages]);

  return (
    <View style={styles.root}>
      {newStatusMessages.map(a => (
        <Snackbar
          announcement={a}
          isStatus
          key={a.uuid}
          onPress={navigateToStatusPage}
          onClose={() => clearStatusMessage(a.uuid)}
        />
      ))}
      {newAnnouncements.map(a => (
        <Snackbar
          announcement={a}
          key={a.uuid}
          onPress={navigateToNotificationCenter}
          onClose={() => clearAnnouncement(a.uuid)}
        />
      ))}
    </View>
  );
}

export default function SnackbarContainer() {
  const announcementsData = useAnnouncements();
  const statusData = useLedgerStatus();
  return announcementsData.initialized && statusData.initialized ? (
    <SnackbarContainerComponent
      announcements={announcementsData}
      status={statusData}
    />
  ) : null;
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    bottom: 50,
    left: 0,
    height: "auto",
    width: "100%",
    zIndex: 100,
    paddingHorizontal: 16,
  },
});
