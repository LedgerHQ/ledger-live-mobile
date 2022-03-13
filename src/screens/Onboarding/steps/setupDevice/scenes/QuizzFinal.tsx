import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Button, Text } from "@ledgerhq/native-ui";

const QuizzFinalScene = ({
  onNext,
  success,
}: {
  onNext: () => void;
  success: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex flex={1}>
        <Text variant="h2" color="palette.neutral.c100" mb={3} uppercase>
          {t(
            `v3.onboarding.quizz.final.${
              success ? "successTitle" : "failTitle"
            }`,
          )}
        </Text>
        <Text variant="paragraph" color="palette.neutral.c80" mb={10}>
          {t(
            `v3.onboarding.quizz.final.${success ? "successText" : "failText"}`,
          )}
        </Text>
      </Flex>
      <Button type="main" size="large" onPress={onNext}>
        {t("v3.onboarding.quizz.final.cta")}
      </Button>
    </>
  );
};

QuizzFinalScene.id = "QuizzFinalScene";

export default QuizzFinalScene;
