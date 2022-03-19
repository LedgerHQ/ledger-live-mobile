import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Button, List, Icons, Text } from "@ledgerhq/native-ui";
import { useNavigation } from "@react-navigation/native";

const content = [
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.0",
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.1",
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.2",
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.3",
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.4",
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.5",
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.6",
  "onboarding.stepSetupDevice.pinCodeSetup.infoModal.bullets.7",
];

const OnboardingSetupDeviceInformation = () => {
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
        <Text variant="h1" mb={6}>
          {t("onboarding.stepSetupDevice.pinCodeSetup.infoModal.title")}
        </Text>
        <List
          items={[...content].slice(0, 4).map(item => ({
            title: t(item),
            bullet: <Icons.CheckAloneMedium size={20} color="success.c100" />,
          }))}
          itemSeparatorProps={{ mb: 7 }}
        />
        <Flex my={8} borderBottomColor="neutral.c40" borderBottomWidth={1} />
        <List
          items={[...content].slice(4, 8).map(item => ({
            title: t(item),
            bullet: <Icons.CloseMedium size={20} color="error.c100" />,
          }))}
          itemSeparatorProps={{ mb: 7 }}
        />
      </Flex>
      <Button type="main" size="large" onPress={navigation.goBack}>
        {t("onboarding.stepSetupDevice.pinCodeSetup.cta")}
      </Button>
    </Flex>
  );
};

export default OnboardingSetupDeviceInformation;
