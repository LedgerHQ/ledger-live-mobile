import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button, Text, Flex } from "@ledgerhq/native-ui";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../../../const";

const RestoreRecoveryPhraseScene = ({ onNext }: { onNext: () => void }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handlePress = useCallback(() => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingModalWarning, {
      screen: ScreenName.OnboardingModalRecoveryPhraseWarning,
      params: { onNext },
    });
  }, [navigation, onNext]);

  return (
    <Flex flex={1}>
      <Text variant="h2" uppercase mb={3}>
        {t("onboarding.stepRecoveryPhrase.importRecoveryPhrase.title")}
      </Text>
      <Text variant="body" color="neutral.c80" mb={3}>
        {t("onboarding.stepRecoveryPhrase.importRecoveryPhrase.desc")}
      </Text>
      <Text variant="body" color="neutral.c80" mb={3}>
        {t("onboarding.stepRecoveryPhrase.importRecoveryPhrase.desc")}
      </Text>
      <Flex flex={1} />
      <Button type="main" size="large" onPress={handlePress}>
        {t("onboarding.stepRecoveryPhrase.importRecoveryPhrase.cta")}
      </Button>
    </Flex>
  );
};

RestoreRecoveryPhraseScene.id = "RestoreRecoveryPhraseScene";

export default RestoreRecoveryPhraseScene;
