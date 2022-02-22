import React from "react";
import { useTranslation } from "react-i18next";
import { Button, NumberedList } from "@ledgerhq/native-ui";

const items = [
  {
    title:
      "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.2.title",
    desc:
      "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.2.label",
  },
  {
    title:
      "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.3.title",
    desc:
      "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.3.label",
  },
  {
    title:
      "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.4.title",
  },
];

const ExistingRecoveryPhraseStep2Scene = ({
  onNext,
}: {
  onNext: () => void;
  deviceModelId: string;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <NumberedList
        items={items.map(item => ({
          title: t(item.title),
          description: item.desc ? t(item.desc) : undefined,
        }))}
      />
      <Button type="main" size="large" onPress={onNext}>
        {t("v3.onboarding.stepRecoveryPhrase.existingRecoveryPhrase.nextStep")}
      </Button>
    </>
  );
};

ExistingRecoveryPhraseStep2Scene.id = "ExistingRecoveryPhraseStep2Scene";

export default ExistingRecoveryPhraseStep2Scene;
