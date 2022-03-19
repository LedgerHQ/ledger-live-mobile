import React from "react";
import { useTranslation } from "react-i18next";
import { Button, NumberedList } from "@ledgerhq/native-ui";

const items = [
  {
    title: "onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.0.title",
    desc: "onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.0.label",
  },
  {
    title: "onboarding.stepSetupDevice.recoveryPhraseSetup.bullets.1.title",
  },
];

const RecoveryPhraseSetupScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();

  return (
    <>
      <NumberedList
        flex={1}
        items={items.map(item => ({
          title: t(item.title),
          description: item.desc ? t(item.desc) : undefined,
        }))}
      />
      <Button type="main" size="large" onPress={onNext}>
        {t("onboarding.stepSetupDevice.recoveryPhraseSetup.cta")}
      </Button>
    </>
  );
};

RecoveryPhraseSetupScene.id = "RecoveryPhraseSetupScene";

export default RecoveryPhraseSetupScene;
