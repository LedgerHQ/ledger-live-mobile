import React from "react";
import { useTranslation } from "react-i18next";
import { Button, NumberedList } from "@ledgerhq/native-ui";

const items = [
  {
    title:
      "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.0.title",
  },
  {
    title:
      "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.1.title",
    desc: `onboarding.stepRecoveryPhrase.existingRecoveryPhrase.bullets.1.label`,
  },
];

const ExistingRecoveryPhraseStep1Scene = ({
  onNext,
}: {
  onNext: () => void;
  deviceModelId: string;
}) => {
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
        {t("onboarding.stepRecoveryPhrase.existingRecoveryPhrase.nextStep")}
      </Button>
    </>
  );
};

ExistingRecoveryPhraseStep1Scene.id = "ExistingRecoveryPhraseStep1Scene";

export default ExistingRecoveryPhraseStep1Scene;
