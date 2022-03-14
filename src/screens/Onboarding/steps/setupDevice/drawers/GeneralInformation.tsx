import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Linking } from "react-native";
import {
  Flex,
  Button,
  Text,
  NumberedList,
  Icons,
  Link,
} from "@ledgerhq/native-ui";
import { urls } from "../../../../../config/urls";

const bullets = [
  "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.bullets.0.label",
  "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.bullets.1.label",
  "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.bullets.2.label",
];

const OnboardingGeneralInformation = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = React.useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(urls.recoveryPhraseInfo);
    if (!supported) return;

    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(urls.recoveryPhraseInfo);
  }, [urls.recoveryPhraseInfo]);

  return (
    <Flex flex={1} p={6} justifyContent="space-between" bg="background.main">
      <FlatList
        data={[{}]}
        renderItem={() => (
          <Flex backgroundColor="background.main">
            <Text variant="h1" color="neutral.c100" uppercase mb={6}>
              {t(
                "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.title",
              )}
            </Text>
            <Text variant="paragraph" color="neutral.c80" mb={6}>
              {t(
                "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.desc",
              )}
            </Text>
            <Text variant="paragraph" color="neutral.c80" mb={6}>
              {t(
                "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.desc_1",
              )}
            </Text>
            <Link
              onPress={handlePress}
              Icon={Icons.ExternalLinkMedium}
              iconPosition="right"
              type="color"
              style={{ justifyContent: "flex-start" }}
            >
              {t(
                "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.link",
              )}
            </Link>
            <Flex
              my={10}
              borderBottomColor="neutral.c40"
              borderBottomWidth={1}
            />
            <Text variant="h1" color="neutral.c100" uppercase mb={6}>
              {t(
                "v3.onboarding.stepSetupDevice.recoveryPhraseSetup.infoModal.title_1",
              )}
            </Text>
            <NumberedList items={bullets.map(item => ({ title: t(item) }))} />
          </Flex>
        )}
      />
      <Button type="main" size="large" onPress={navigation.goBack}>
        {t("v3.onboarding.stepSetupDevice.hideRecoveryPhrase.cta")}
      </Button>
    </Flex>
  );
};

export default OnboardingGeneralInformation;
