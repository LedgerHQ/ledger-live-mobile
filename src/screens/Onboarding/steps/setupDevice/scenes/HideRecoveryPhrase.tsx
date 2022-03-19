import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Button, Text, IconBoxList, Icons } from "@ledgerhq/native-ui";

const items = [
  {
    title: "onboarding.stepSetupDevice.hideRecoveryPhrase.bullets.0.label",
    /*
     ** @TODO: Correct icon isn't included in the ui library yet.
     ** Replace this placeholder as soon as it's available.
     */
    Icon: Icons.MinusMedium,
  },
  {
    title: "onboarding.stepSetupDevice.hideRecoveryPhrase.bullets.1.label",
    Icon: Icons.EyeNoneMedium,
  },
];

const HideRecoveryPhraseScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex flex={1}>
        <Text variant="h2" color="palette.neutral.c100" mb={3} uppercase>
          {t("onboarding.stepSetupDevice.hideRecoveryPhrase.title")}
        </Text>
        <Text variant="paragraph" color="palette.neutral.c80" mb={16}>
          {t("onboarding.stepSetupDevice.hideRecoveryPhrase.desc")}
        </Text>
        <IconBoxList
          items={items.map(item => ({ ...item, title: t(item.title) }))}
        />
      </Flex>
      <Button type="main" size="large" onPress={onNext}>
        {t("onboarding.stepSetupDevice.hideRecoveryPhrase.cta")}
      </Button>
    </>
  );
};

HideRecoveryPhraseScene.id = "HideRecoveryPhraseScene";

export default HideRecoveryPhraseScene;
