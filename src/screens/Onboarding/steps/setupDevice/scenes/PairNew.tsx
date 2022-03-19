import React from "react";
import { useTranslation } from "react-i18next";
import { Flex, Button, Text } from "@ledgerhq/native-ui";

const PairNewScene = ({
  onNext,
  deviceModelId,
}: {
  onNext: () => void;
  deviceModelId: string;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex flex={1}>
        <Text variant="h2" color="palette.neutral.c100" mb={3} uppercase>
          {t(`onboarding.stepPairNew.${deviceModelId}.title`)}
        </Text>
        <Text variant="paragraph" color="palette.neutral.c80" mb={10}>
          {t(`onboarding.stepPairNew.${deviceModelId}.desc`)}
        </Text>
      </Flex>
      <Button type="main" size="large" onPress={onNext}>
        {t(`onboarding.stepPairNew.${deviceModelId}.cta`)}
      </Button>
    </>
  );
};

PairNewScene.id = "PairNewScene";

export default PairNewScene;
