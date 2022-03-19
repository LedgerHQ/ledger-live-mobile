import React from "react";
import { useTranslation } from "react-i18next";
import { Button, NumberedList } from "@ledgerhq/native-ui";

const items = [
  {
    title:
      "onboarding.stepSetupDevice.recoverySheetInstructions.bullets.0.title",
    desc: "onboarding.stepSetupDevice.recoverySheetInstructions.bullets.0.desc",
  },
  {
    title:
      "onboarding.stepSetupDevice.recoverySheetInstructions.bullets.1.title",
    desc: "onboarding.stepSetupDevice.recoverySheetInstructions.bullets.1.desc",
  },
];

const RecoveryPhraseInstructionsScene = ({
  onNext,
}: {
  onNext: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <NumberedList
        flex={1}
        items={items.map(item => ({
          title: t(item.title),
          description: t(item.desc),
        }))}
      />
      <Button type="main" size="large" onPress={onNext}>
        {t("onboarding.stepSetupDevice.pinCode.cta")}
      </Button>
    </>
  );
};

RecoveryPhraseInstructionsScene.id = "RecoveryPhraseInstructionsScene";

export default RecoveryPhraseInstructionsScene;
