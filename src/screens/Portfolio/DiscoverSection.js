// @flow
import React, { useCallback, useMemo, useState } from "react";
import { Flex, Text } from "@ledgerhq/native-ui";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import useEnv from "@ledgerhq/live-common/lib/hooks/useEnv";
import { filterPlatformApps } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/helpers";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { useNavigation } from "@react-navigation/native";
import { Trans, useTranslation } from "react-i18next";
import AppIcon from "../Platform/AppIcon";
import { useBanner } from "../../components/banners/hooks";
import { NavigatorName, ScreenName } from "../../const";
import DAppDisclaimer from "../Platform/DAppDisclaimer";
import LText from "../../components/LText";
import Button from "../../components/Button";

const DAPP_DISCLAIMER_ID = "PlatformAppDisclaimer";

export default function DiscoverSection() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { manifests } = usePlatformApp();
  const experimental = useEnv("PLATFORM_EXPERIMENTAL_APPS");

  const filteredManifests = useMemo(() => {
    const branches = ["stable", ...(experimental ? ["experimental"] : [])];

    return filterPlatformApps(Array.from(manifests.values()), {
      version: "0.0.1",
      platform: "mobile",
      branches,
    });
  }, [manifests, experimental]);

  const [disclaimerOpts, setDisclaimerOpts] = useState<any>(null);
  const [disclaimerOpened, setDisclaimerOpened] = useState<boolean>(false);
  const [disclaimerDisabled, setDisclaimerDisabled] = useBanner(
    DAPP_DISCLAIMER_ID,
  );

  const handlePressCard = useCallback(
    (manifest: AppManifest) => {
      const openDApp = () =>
        navigation.navigate(ScreenName.PlatformApp, {
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
    [navigation, setDisclaimerDisabled, disclaimerDisabled],
  );

  const onSeeMoreButtonPress = useCallback(() => {
    navigation.navigate(NavigatorName.Platform);
  }, [navigation]);

  return (
    <View style={styles.discoverContainer}>
      <LText bold secondary style={styles.discoverTitle}>
        <Trans i18nKey={"tabs.platform"} />
      </LText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filteredManifests.map(manifest => (
          <TouchableOpacity onPress={() => handlePressCard(manifest)}>
            <Flex mr={3} alignItems={"center"} width={"72px"}>
              <AppIcon size={58} name={manifest.name} icon={manifest.icon} />
              <Text
                variant={"paragraph"}
                fontWeight={"medium"}
                numberOfLines={1}
                mt={3}
              >
                {manifest.name}
              </Text>
            </Flex>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.seeMoreBtn}>
        <Button
          event="View Discover"
          type="lightPrimary"
          title={t("common.seeAll")}
          onPress={onSeeMoreButtonPress}
        />
      </View>
      {disclaimerOpts && (
        <DAppDisclaimer
          disableDisclaimer={disclaimerOpts.disableDisclaimer}
          closeDisclaimer={disclaimerOpts.closeDisclaimer}
          onContinue={disclaimerOpts.onContinue}
          isOpened={disclaimerOpened}
          icon={disclaimerOpts.icon}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  discoverTitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  discoverContainer: {
    paddingHorizontal: 16,
  },
  seeMoreBtn: {
    marginTop: 16,
    marginBottom: 32,
  },
});
