import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Flex } from "@ledgerhq/native-ui";
import { useTranslation } from "react-i18next";
import { keyBy } from "lodash";

import { platformAppsLastOpenedSelector } from "../../reducers/settings";
import SectionHeader from "./SectionHeader";
import AppThumbnailSmall from "./AppThumbnailSmall";
import { SectionBaseProps } from "./types";

const NB_RECENTLY_USED_SHOWN = 4;
const SectionRecentlyUsed = ({
  filteredManifests,
  handlePressApp,
}: SectionBaseProps) => {
  const { t } = useTranslation();
  const lastOpenedApps = useSelector(platformAppsLastOpenedSelector);
  const filteredManifestsById = useMemo(() => keyBy(filteredManifests, "id"), [
    filteredManifests,
  ]);
  const lastOpenedAppsList = useMemo(
    () =>
      [
        ...Object.keys(lastOpenedApps)
          .filter(appId =>
            Object.prototype.hasOwnProperty.call(filteredManifestsById, appId),
          )
          .sort((a, b) => lastOpenedApps[b] - lastOpenedApps[a]),
        ...Array(NB_RECENTLY_USED_SHOWN).fill(""),
      ].slice(0, 4),
    [lastOpenedApps, filteredManifestsById],
  );
  return (
    <Flex flexDirection="column">
      <SectionHeader title={t("platform.recentlyUsed")} />
      {lastOpenedAppsList.length > 0 && (
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          marginBottom={40}
        >
          {lastOpenedAppsList.map(appName => (
            <AppThumbnailSmall
              appManifest={filteredManifestsById[appName]}
              onPress={handlePressApp}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default SectionRecentlyUsed;
