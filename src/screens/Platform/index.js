// @flow

import React, { useMemo, useCallback } from "react";
import { StyleSheet, ScrollView, View, Linking } from "react-native";
import { Trans } from "react-i18next";
import SafeAreaView from "react-native-safe-area-view";
import { useNavigation, useTheme } from "@react-navigation/native";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { useCatalog } from "@ledgerhq/live-common/lib/platform/CatalogProvider";
import type { AccountLike, Account } from "@ledgerhq/live-common/lib/types";

import TrackScreen from "../../analytics/TrackScreen";
import { urls } from "../../config/urls";
import { ScreenName } from "../../const";
import LText from "../../components/LText";
import IconCode from "../../icons/Code";
import IconPoll from "../../icons/Poll";

import CatalogBanner from "./CatalogBanner";
import CatalogCTA from "./CatalogCTA";
import AppCard from "./AppCard";

type RouteParams = {
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
};

const PlatformCatalog = ({ route }: { route: { params: RouteParams } }) => {
  const { params: routeParams } = route;
  const { colors } = useTheme();
  const navigation = useNavigation();
  const appBranches = useMemo(() => {
    const branches = ["stable", "soon", "experimental"];

    // TODO: add experimental setting

    if (getEnv("PLATFORM_DEBUG")) {
      branches.push("debug");
    }

    return branches;
  }, []);

  const { apps } = useCatalog("mobile", appBranches);

  const handlePressCard = useCallback(
    (manifest: AppManifest) => {
      navigation.navigate(ScreenName.PlatformApp, {
        platform: manifest.id,
        name: manifest.name,
        ...routeParams,
      });
    },
    [navigation, routeParams],
  );

  const handlePollCTAPress = useCallback(() => {
    Linking.openURL(urls.platform.poll);
  }, []);

  const handleDeveloperCTAPress = useCallback(() => {
    Linking.openURL(urls.platform.developerPage);
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <TrackScreen category="Platform" name="Catalog" />
      <LText style={styles.title} semiBold secondary>
        <Trans i18nKey={"platform.catalog.title"} />
      </LText>
      <ScrollView style={styles.wrapper}>
        <CatalogBanner />
        {apps.map(manifest => (
          <AppCard
            key={manifest.id}
            manifest={manifest}
            onPress={handlePressCard}
          />
        ))}
        <CatalogCTA
          type="dashed"
          Icon={IconPoll}
          title={<Trans i18nKey={"platform.catalog.pollCTA.title"} />}
          onPress={handlePollCTAPress}
        >
          <Trans i18nKey={"platform.catalog.pollCTA.description"} />
        </CatalogCTA>
        <View style={[styles.separator, { backgroundColor: colors.fog }]} />
        <CatalogCTA
          Icon={IconCode}
          title={<Trans i18nKey={"platform.catalog.developerCTA.title"} />}
          onPress={handleDeveloperCTAPress}
        >
          <Trans i18nKey={"platform.catalog.developerCTA.description"} />
        </CatalogCTA>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    textAlign: "left",
    marginHorizontal: 16,
    marginVertical: 24,
  },
  separator: {
    width: "100%",
    height: 1,
    marginBottom: 24,
  },
});

export default PlatformCatalog;
