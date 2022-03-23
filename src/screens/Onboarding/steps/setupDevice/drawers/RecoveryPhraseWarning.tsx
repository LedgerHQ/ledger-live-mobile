import React from "react";
import { useTranslation } from "react-i18next";
import {
  Flex,
  Button,
  Text,
  Icons,
  IconBox,
  ScrollContainer,
} from "@ledgerhq/native-ui";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

type WarningRouteProps = RouteProp<
  { params: { onNext?: () => void } },
  "params"
>;

const OnboardingRecoveryPhraseWarning = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<WarningRouteProps>();

  const handlePress = () => {
    navigation.goBack();
    if (route.params.onNext) route.params.onNext();
  };

  return (
    <>
      <ScrollContainer flex={1}>
        <Flex alignItems="center">
          <IconBox
            Icon={Icons.WarningMedium}
            color="warning.c100"
            iconSize={24}
            boxSize={64}
          />
          <Text
            variant="h2"
            color="neutral.c100"
            mt={8}
            uppercase
            textAlign="center"
          >
            {t(
              "onboarding.stepRecoveryPhrase.importRecoveryPhrase.warning.title",
            )}
          </Text>
          <Text
            variant="paragraph"
            color="neutral.c80"
            mt={6}
            textAlign="center"
          >
            {t(
              "onboarding.stepRecoveryPhrase.importRecoveryPhrase.warning.desc",
            )}
          </Text>
        </Flex>
      </ScrollContainer>
      <Button type="main" size="large" onPress={handlePress}>
        {t("onboarding.stepRecoveryPhrase.importRecoveryPhrase.warning.cta")}
      </Button>
    </>
  );
};

export default OnboardingRecoveryPhraseWarning;
