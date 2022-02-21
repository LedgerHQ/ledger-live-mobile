import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { Flex, Text, Button, Carousel } from "@ledgerhq/native-ui";

import { TrackScreen } from "../../../analytics";
import nanoS from "../assets/nanoS";
import nanoX from "../assets/nanoX";
import Touchable from "../../../components/Touchable";
import { ScreenName } from "../../../const";
import OnboardingView from "../OnboardingView";

const devices = [nanoS, nanoX];

const Card = styled(Flex).attrs({
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  borderStyle: "solid",
  borderWidth: 1,
  borderColor: "palette.neutral.c40",
})``;
Card.widthInPercent = 90;

function OnboardingStepDeviceSelection() {
  const [devicePicked, setDevicePicked] = useState<null | string>(null);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const next = () => {
    // TODO: FIX @react-navigation/native using Typescript
    // @ts-ignore next-line
    navigation.navigate(ScreenName.OnboardingUseCase, {
      deviceModelId: devicePicked,
    });
  };

  return (
    <OnboardingView
      hasBackButton
      centerTitle
      title={t("onboarding.stepSelectDevice.title")}
      footer={
        <Flex flexDirection="row" justifyContent="center">
          <Button
            disabled={!devicePicked}
            onPress={next}
            testID={`Onboarding Device - Selection|${devicePicked}`}
            type="main"
          >
            {t("v3.onboarding.stepSelectDevice.chooseDevice")}
          </Button>
        </Flex>
      }
    >
      <Carousel
        containerProps={{ flex: 0.9 }}
        scrollViewProps={{
          contentContainerStyle: {
            paddingLeft: "10%",
            width: `${Card.widthInPercent * devices.length}%`,
          },
        }}
      >
        {devices.map(Device => (
          <Touchable
            key={Device.id}
            event="Onboarding Device - Selection"
            eventProperties={{ id: Device.id }}
            testID={`Onboarding Device - Selection|${Device.id}`}
            onPress={() => setDevicePicked(Device.id)}
            style={{ width: `${Card.widthInPercent}%`, paddingTop: 48 }}
          >
            <Card
              backgroundColor={
                devicePicked === Device.id ? "palette.neutral.c30" : null
              }
            >
              <Device />
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
