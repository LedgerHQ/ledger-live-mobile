import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Flex, Text, Button, Carousel } from "@ledgerhq/native-ui";
import { TrackScreen } from "../../../analytics";
import nanoS from "../assets/nanoS";
import nanoSP from "../assets/nanoSP";
import nanoX from "../assets/nanoX";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";
import OnboardingView from "../OnboardingView";

const devices = [nanoX, nanoSP, nanoS];

const Card = styled(Flex).attrs({
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "palette.neutral.c40",
  mx: 9,
})``;

function OnboardingStepDeviceSelection() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const next = (deviceModelId: string) => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingUseCase, {
      deviceModelId,
    });
  };

  return (
    <OnboardingView
      hasBackButton
      centerTitle
      title={t("onboarding.stepSelectDevice.title")}
    >
      <Carousel containerProps={{ flex: 0.9 }} scrollViewProps={{}}>
        {devices.map(Device => (
          <Touchable
            key={Device.id}
            event="Onboarding Device - Selection"
            eventProperties={{ id: Device.id }}
            testID={`Onboarding Device - Selection|${Device.id}`}
            onPress={() => next(Device.id)}
          >
            <Card>
              <Device fill={colors.neutral.c100} />
              <Text variant="small" fontSize={2} mt={8}>
                Ledger
              </Text>
              <Text variant="h1" fontSize={8} mt={3}>
                {t(`onboarding.stepSelectDevice.${Device.id}`)}
              </Text>
            </Card>
          </Touchable>
        ))}
      </Carousel>
      <TrackScreen category="Onboarding" name="SelectDevice" />
    </OnboardingView>
  );
}

export default OnboardingStepDeviceSelection;
