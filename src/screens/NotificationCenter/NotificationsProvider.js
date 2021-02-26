// @flow
import React, { useCallback } from "react";
import { AnnoucementProvider } from "@ledgerhq/live-common/lib/announcements/react";
import { useSelector } from "react-redux";
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

  return (
    <AnnoucementProvider
      context={{
        language: locale,
        currencies,
        getDate: () => new Date(),
      }}
      onLoad={onLoad}
      onSave={onSave}
    >
      {children}
    </AnnoucementProvider>
  );
}
