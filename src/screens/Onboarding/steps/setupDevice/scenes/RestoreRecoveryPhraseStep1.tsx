import React from "react";
import { useTranslation } from "react-i18next";
import { Button, NumberedList } from "@ledgerhq/native-ui";

const RestoreRecoveryPhraseStep1Scene = ({
  onNext,
  deviceModelId,
}: {
  onNext: () => void;
  deviceModelId: string;
}) => {
  const { t } = useTranslation();

  const items = [
    {
      title:
        "v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.0.title",
      desc: `v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.0.${deviceModelId}.label`,
    },
    {
      title:
        "v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.1.title",
      desc: `v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.1.label`,
    },
    {
      title:
        "v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.2.title",
      desc: `v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.2.label`,
    },
    {
      title:
        "v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.3.title",
      desc: `v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.bullets.3.label`,
    },
  ];

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
        {t("v3.onboarding.stepRecoveryPhrase.importRecoveryPhrase.nextStep")}
      </Button>
    </>
  );
};

RestoreRecoveryPhraseStep1Scene.id = "RestoreRecoveryPhraseStep1Scene";

export default RestoreRecoveryPhraseStep1Scene;
