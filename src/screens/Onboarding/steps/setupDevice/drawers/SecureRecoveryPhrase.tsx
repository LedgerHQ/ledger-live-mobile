import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Flex, Button, Text, List, Icons } from "@ledgerhq/native-ui";
import { useNavigation } from "@react-navigation/native";

const content = [
  "v3.onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.0.label",
  "v3.onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.1.label",
  "v3.onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.2.label",
  "v3.onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.3.label",
  "v3.onboarding.stepSetupDevice.hideRecoveryPhrase.infoModal.bullets.4.label",
];

const Bold = ({ children }: { children?: React.ReactNode }) => (
  <Text fontWeight="bold" uppercase>
    {children}
  </Text>
);

const OnboardingSetupRecoveryPhrase = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Flex
      flex={1}
      p={6}
      justifyContent="space-between"
      backgroundColor="background.main"
    >
      <Flex>
        <Text variant="h1" color="neutral.c100" mb={8}>
          {t("v3.onboarding.stepSetupDevice.hideRecoveryPhrase.title")}
        </Text>
        <List
          items={content.map(item => ({
            title: <Trans i18nKey={item} components={{ bold: <Bold /> }} />,
            bullet: <Icons.CheckAloneMedium size={20} color="success.c100" />,
          }))}
          itemSeparatorProps={{ mb: 7 }}
        />
      </Flex>
      <Button type="main" size="large" onPress={navigation.goBack}>
        {t("v3.onboarding.stepSetupDevice.hideRecoveryPhrase.cta")}
      </Button>
    </Flex>
  );
};

export default OnboardingSetupRecoveryPhrase;
