// @flow
import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { AnnouncementProvider } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider";
import { ServiceStatusProvider } from "@ledgerhq/live-common/lib/providers/ServiceStatusProvider";
import { useToasts } from "@ledgerhq/live-common/lib/providers/ToastProvider/index";
import type { Announcement } from "@ledgerhq/live-common/lib/providers/AnnouncementProvider/types";
import { getNotifications, saveNotifications } from "../../db";
import { useLocale } from "../../context/Locale";
import { cryptoCurrenciesSelector } from "../../reducers/accounts";

type Props = {
  children: React$Node,
};

export default function NotificationsProvider({ children }: Props) {
  const { locale } = useLocale();
  const c = useSelector(cryptoCurrenciesSelector);
  const currencies = c.map(({ family }) => family);
  const { pushToast } = useToasts();

  const onLoad = useCallback(
    () =>
      getNotifications().then(dbData => {
        const {
          announcements = [],
          seenIds = [],
          lastUpdateTime = new Date().getTime(),
        } = dbData || {};
        return {
          announcements,
          seenIds,
          lastUpdateTime,
        };
      }),
    [],
  );

  const onSave = useCallback(
    ({ announcements, seenIds, lastUpdateTime }) =>
      saveNotifications({ announcements, seenIds, lastUpdateTime }),
    [],
  );

  const onNewAnnouncement = useCallback(
    (announcement: Announcement) => {
      const { uuid, content, icon } = announcement;

      pushToast({
        id: uuid,
        type: "announcement",
        title: content.title,
        text: content.text,
        icon,
      });
    },
    [pushToast],
  );

  return (
    <AnnouncementProvider
      autoUpdateDelay={15000}
      context={{
        language: locale,
        currencies,
        getDate: () => new Date(),
      }}
      handleLoad={onLoad}
      handleSave={onSave}
      onNewAnnouncement={onNewAnnouncement}
    >
      <ServiceStatusProvider autoUpdateDelay={15000}>
        {children}
      </ServiceStatusProvider>
    </AnnouncementProvider>
  );
}
