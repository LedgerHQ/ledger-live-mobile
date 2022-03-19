import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Button, Text, Switch } from "@ledgerhq/native-ui";

const RecoveryPhraseScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState(false);

  const onChange = () => setChecked(currentState => !currentState);

  return (
    <>
      <Flex flex={1}>
        <Text variant="h2" color="palette.neutral.c100" mb={4} uppercase>
          {t("onboarding.stepSetupDevice.recoveryPhrase.title")}
        </Text>
        <Text variant="paragraph" color="palette.neutral.c80" mb={4}>
          {t("onboarding.stepSetupDevice.recoveryPhrase.desc")}
        </Text>
        <Text variant="paragraph" color="palette.neutral.c80" mb={10}>
          {t("onboarding.stepSetupDevice.recoveryPhrase.desc_1")}
        </Text>
        <Switch
          checked={checked}
          onChange={onChange}
          label={t("onboarding.stepSetupDevice.recoveryPhrase.checkboxDesc")}
        />
      </Flex>
      <Button disabled={!checked} type="main" size="large" onPress={onNext}>
        {t("onboarding.stepSetupDevice.recoveryPhrase.cta")}
      </Button>
    </>
  );
};

RecoveryPhraseScene.id = "RecoveryPhraseScene";

export default RecoveryPhraseScene;
