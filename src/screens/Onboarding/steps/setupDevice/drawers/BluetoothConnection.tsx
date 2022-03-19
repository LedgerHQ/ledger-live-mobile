import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Linking, Platform } from "react-native";
import {
  Flex,
  Button,
  Text,
  IconBoxList,
  Icons,
  Link as UILink,
} from "@ledgerhq/native-ui";
import { urls } from "../../../../../config/urls";

const bullets = [
  "onboarding.stepPairNew.infoModal.bullets.0.label",
  "onboarding.stepPairNew.infoModal.bullets.1.label",
  "onboarding.stepPairNew.infoModal.bullets.2.label",
];

const BluetoothConnection = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = React.useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(urls.fixConnectionIssues);
    if (!supported) return;

    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(urls.fixConnectionIssues);
  }, []);

  return (
    <Flex flex={1} p={6} justifyContent="space-between" bg="background.main">
      <FlatList
        data={[
          <Flex>
            <Text variant="h1" color="neutral.c100" uppercase mb={6}>
              {t("onboarding.stepPairNew.infoModal.title_1")}
            </Text>
            <IconBoxList
              items={bullets.map((item, i) => ({
                title: (
                  <Trans i18nKey={item} values={{ Os: Platform.OS }}>
                    <Text />
                    <Text uppercase fontWeight="bold" />
                  </Trans>
                ),
                Icon: Icons.ChevronRightMedium,
              }))}
            />
            <UILink
              type="color"
              onPress={handlePress}
              Icon={Icons.ExternalLinkMedium}
            >
              {t("onboarding.stepPairNew.infoModal.bullets.2.link")}
            </UILink>
          </Flex>,
          ...(Platform.OS === "ios"
            ? []
            : [
                <Flex height={1} width="100%" bg="neutral.c40" my={8} />,
                ,
                <Flex>
                  <Text variant="h1" color="neutral.c100" uppercase mb={6}>
                    {t("onboarding.stepPairNew.infoModal.title_2")}
                  </Text>
                  <Text variant="body" color="neutral.c80" mb={6}>
                    <Trans i18nKey="onboarding.stepPairNew.infoModal.desc_1">
                      <Text />
                      <Text fontWeight="bold" />
                    </Trans>
                  </Text>
                </Flex>,
              ]),
        ]}
        renderItem={({ item }) => <>{item}</>}
      />
      <Button type="main" size="large" onPress={navigation.goBack}>
        {t("onboarding.stepSetupDevice.hideRecoveryPhrase.cta")}
      </Button>
    </Flex>
  );
};

export default BluetoothConnection;
