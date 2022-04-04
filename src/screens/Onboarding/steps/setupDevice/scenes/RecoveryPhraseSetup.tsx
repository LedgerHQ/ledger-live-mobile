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

const RecoveryPhraseSetupScene = () => {
  const { t } = useTranslation();

  return (
    <NumberedList
      flex={1}
      items={items.map(item => ({
        title: t(item.title),
        description: item.desc ? t(item.desc) : undefined,
      }))}
    />
  );
};

RecoveryPhraseSetupScene.id = "RecoveryPhraseSetupScene";

const Next = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  return (
    <Button type="main" size="large" onPress={onNext}>
      {t("onboarding.stepSetupDevice.recoveryPhraseSetup.cta")}
    </Button>
  );
};

RecoveryPhraseSetupScene.Next = Next;

export default RecoveryPhraseSetupScene;
