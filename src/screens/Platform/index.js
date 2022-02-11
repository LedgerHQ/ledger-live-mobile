// @flow

import React, { useMemo, useCallback, useState, useEffect } from "react";
import { StyleSheet, View, Linking } from "react-native";
import { Trans } from "react-i18next";
import { useNavigation, useTheme } from "@react-navigation/native";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import { filterPlatformApps } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/helpers";
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";
import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";

import { useBanner } from "../../components/banners/hooks";
import TrackScreen from "../../analytics/TrackScreen";
import { urls } from "../../config/urls";
import { ScreenName } from "../../const";
import IconCode from "../../icons/Code";

import CatalogTwitterBanner from "./CatalogTwitterBanner";
import DAppDisclaimer from "./DAppDisclaimer";
import type { Props as DisclaimerProps } from "./DAppDisclaimer";
import CatalogBanner from "./CatalogBanner";
import CatalogCTA from "./CatalogCTA";
import AppCard from "./AppCard";
import AnimatedHeaderView from "../../components/AnimatedHeader";

type RouteParams = {
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
  platform?: ?string,
};

type DisclaimerOpts = $Diff<DisclaimerProps, { isOpened: boolean }> | null;

const DAPP_DISCLAIMER_ID = "PlatformAppDisclaimer";

const PlatformCatalog = ({ route }: { route: { params: RouteParams } }) => {
  const { platform, ...routeParams } = route.params ?? {};
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { manifests } = usePlatformApp();
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
          name: manifest.name,
          onContinue: openDApp,
        });
        setDisclaimerOpened(true);
      } else {
        openDApp();
      }
    },
    [navigation, routeParams, setDisclaimerDisabled, disclaimerDisabled],
  );

  const handleDeveloperCTAPress = useCallback(() => {
    Linking.openURL(urls.platform.developerPage);
  }, []);

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

  return (
    <AnimatedHeaderView
      titleStyle={styles.title}
      title={<Trans i18nKey={"platform.catalog.title"} />}
    >
      <TrackScreen category="Platform" name="Catalog" />
      {disclaimerOpts && (
        <DAppDisclaimer
          disableDisclaimer={disclaimerOpts.disableDisclaimer}
          closeDisclaimer={disclaimerOpts.closeDisclaimer}
          onContinue={disclaimerOpts.onContinue}
          isOpened={disclaimerOpened}
          icon={disclaimerOpts.icon}
          name={disclaimerOpts.name}
        />
      )}

      <CatalogBanner />
      <CatalogTwitterBanner />
      {filteredManifests.map(manifest => (
        <AppCard
          key={manifest.id}
          manifest={manifest}
          onPress={handlePressCard}
        />
      ))}
      <View style={[styles.separator, { backgroundColor: colors.fog }]} />
      <CatalogCTA
        Icon={IconCode}
        title={<Trans i18nKey={"platform.catalog.developerCTA.title"} />}
        onPress={handleDeveloperCTAPress}
      >
        <Trans i18nKey={"platform.catalog.developerCTA.description"} />
      </CatalogCTA>
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
