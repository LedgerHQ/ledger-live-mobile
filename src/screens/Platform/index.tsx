import React, { useMemo, useCallback, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import { filterPlatformApps } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/helpers";
import { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";
import { keyBy } from "lodash";

import { useBanner } from "../../components/banners/hooks";
import TrackScreen from "../../analytics/TrackScreen";
import { ScreenName } from "../../const";
import { setPlatformAppLastOpened } from "../../actions/settings";

import DAppDisclaimer, { Props as DisclaimerProps } from "./DAppDisclaimer";
import AnimatedHeaderView from "../../components/AnimatedHeader";
import SectionHeader from "./SectionHeader";
import Filter from "./Filter";
import SectionRecentlyUsed from "./SectionRecentlyUsed";
import AppsList from "./AppsList";

type RouteParams = {
  defaultAccount: AccountLike | null | undefined;
  defaultParentAccount: Account | null | undefined;
  platform?: string | null | undefined;
};

type DisclaimerOpts = Omit<DisclaimerProps, "isOpened"> | null;

const DAPP_DISCLAIMER_ID = "PlatformAppDisclaimer";

const PlatformCatalog = ({ route }: { route: { params: RouteParams } }) => {
  const { platform, ...routeParams } = route.params ?? {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { manifests, catalogMetadata } = usePlatformApp();
  const { appsMetadata, supercategories = [] } = catalogMetadata || {};

  const appsMetadataMappedById = useMemo(() => keyBy(appsMetadata, "id"), [
    appsMetadata,
  ]);

  const experimental = useEnv("PLATFORM_EXPERIMENTAL_APPS");

  const filteredManifests = useMemo(() => {
    const branches = [
      "stable",
      "soon",
      ...(experimental ? ["experimental"] : []),
    ];

    return filterPlatformApps(Array.from(manifests.values()), {
      version: "0.0.1",
      platform: "mobile",
      branches,
    });
  }, [manifests, experimental]);

  // Disclaimer State
  const [disclaimerOpts, setDisclaimerOpts] = useState<DisclaimerOpts>(null);
  const [disclaimerOpened, setDisclaimerOpened] = useState<boolean>(false);
  const [disclaimerDisabled, setDisclaimerDisabled] = useBanner(
    DAPP_DISCLAIMER_ID,
  );

  const handlePressCard = useCallback(
    (manifest: AppManifest) => {
      dispatch(setPlatformAppLastOpened(manifest.id, Date.now()));
      const openDApp = () =>
        navigation.navigate(ScreenName.PlatformApp, {
          ...routeParams,
          platform: manifest.id,
          name: manifest.name,
        });

      if (!disclaimerDisabled) {
        setDisclaimerOpts({
          disableDisclaimer: () => setDisclaimerDisabled(),
          closeDisclaimer: () => setDisclaimerOpened(false),
          icon: manifest.icon,
          onContinue: openDApp,
        });
        setDisclaimerOpened(true);
      } else {
        openDApp();
      }
    },
    [
      navigation,
      routeParams,
      setDisclaimerDisabled,
      disclaimerDisabled,
      dispatch,
    ],
  );

  useEffect(() => {
    // platform can be predefined when coming from a deeplink
    if (platform && filteredManifests) {
      const manifest = filteredManifests.find(m => m.id === platform);

      if (manifest) {
        navigation.navigate(ScreenName.PlatformApp, {
          ...routeParams,
          platform: manifest.id,
          name: manifest.name,
        });
      }
    }
  }, [platform, filteredManifests, navigation, routeParams]);

  const [supercategoryFilter, setSupercategoryFilter] = useState("all");

  const supercategoryFilteredManifests = useMemo(
    () =>
      filteredManifests.filter(
        (manifest: AppManifest) =>
          appsMetadataMappedById[manifest.id]?.supercategory ===
          supercategoryFilter,
      ),
    [appsMetadataMappedById, supercategoryFilter, filteredManifests],
  );

  const handlePressSupercategory = useCallback(
    supercategory => {
      setSupercategoryFilter(supercategory);
    },
    [setSupercategoryFilter],
  );

  const supercategoriesOptions = useMemo(
    () =>
      ["all", ...supercategories].map(supercategory => ({
        value: supercategory,
        label: t(`platform.category.${supercategory}`),
        enabled: supercategoryFilter === supercategory,
        onPress: () => handlePressSupercategory(supercategory),
      })),
    [t, supercategories, handlePressSupercategory, supercategoryFilter],
  );

  return (
    <AnimatedHeaderView
      titleStyle={styles.title}
      title={t("platform.catalog.title")}
    >
      <TrackScreen category="Platform" name="Catalog" />
      {disclaimerOpts && (
        <DAppDisclaimer
          disableDisclaimer={disclaimerOpts.disableDisclaimer}
          closeDisclaimer={disclaimerOpts.closeDisclaimer}
          onContinue={disclaimerOpts.onContinue}
          isOpened={disclaimerOpened}
          icon={disclaimerOpts.icon}
        />
      )}
      <Filter options={supercategoriesOptions} />
      {supercategoryFilter === "all" ? (
        <>
          <SectionRecentlyUsed
            handlePressApp={handlePressCard}
            filteredManifests={filteredManifests}
            catalogMetadata={catalogMetadata}
          />
          <SectionHeader title={t("platform.liveApps")} />
          <AppsList
            handlePressApp={handlePressCard}
            filteredManifests={filteredManifests}
            catalogMetadata={catalogMetadata}
          />
        </>
      ) : (
        <AppsList
          handlePressApp={handlePressCard}
          filteredManifests={supercategoryFilteredManifests}
          catalogMetadata={catalogMetadata}
        />
      )}
    </AnimatedHeaderView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: "left",
  },
  separator: {
    width: "100%",
    height: 1,
    marginBottom: 24,
  },
});

export default PlatformCatalog;