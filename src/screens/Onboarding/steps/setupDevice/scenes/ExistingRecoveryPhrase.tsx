import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Button, Text, Switch } from "@ledgerhq/native-ui";

const ExistingRecoveryPhraseScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = React.useState(false);

  const onChange = () => setChecked(currentState => !currentState);

  return (
    <>
      <Flex flex={1}>
        <Text variant="h2" color="palette.neutral.c100" mb={3} uppercase>
          {t("onboarding.stepRecoveryPhrase.existingRecoveryPhrase.title")}
        </Text>
        <Text variant="paragraph" color="palette.neutral.c80" mb={3}>
          {t("onboarding.stepRecoveryPhrase.existingRecoveryPhrase.paragraph1")}
        </Text>
        <Text variant="paragraph" color="palette.neutral.c80" mb={10}>
          {t("onboarding.stepRecoveryPhrase.existingRecoveryPhrase.paragraph2")}
        </Text>
        <Switch
          checked={checked}
          onChange={onChange}
          label={t(
            "onboarding.stepRecoveryPhrase.existingRecoveryPhrase.checkboxDesc",
          )}
        />
      </Flex>
      <Button disabled={!checked} type="main" size="large" onPress={onNext}>
        {t("onboarding.stepRecoveryPhrase.existingRecoveryPhrase.nextStep")}
      </Button>
    </>
  );
};

ExistingRecoveryPhraseScene.id = "ExistingRecoveryPhraseScene";

export default ExistingRecoveryPhraseScene;
