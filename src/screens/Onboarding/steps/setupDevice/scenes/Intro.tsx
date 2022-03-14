import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Text, Button, IconBoxList, Icons } from "@ledgerhq/native-ui";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../../../const";

const items = [
  {
    title: "v3.onboarding.stepSetupDevice.start.bullets.0.label",
    Icon: Icons.ClockMedium,
  },
  {
    title: "v3.onboarding.stepSetupDevice.start.bullets.1.label",
    Icon: Icons.PenMedium,
  },
  {
    title: "v3.onboarding.stepSetupDevice.start.bullets.2.label",
    Icon: Icons.CoffeeMedium,
  },
];

const IntroScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const next = () => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingModalWarning, {
      onNext: onNext,
    });
  };

  return (
    <>
      <Flex flex={1}>
        <Text variant="h2" mb={10} uppercase>
          {t("v3.onboarding.stepSetupDevice.start.title")}
        </Text>
        <IconBoxList
          items={items.map(item => ({ ...item, title: t(item.title) }))}
        />
      </Flex>
      <Button type="main" size="large" onPress={next}>
        {t("v3.onboarding.stepSetupDevice.start.cta")}
      </Button>
    </>
  );
};

IntroScene.id = "IntroScene";

export default IntroScene;
