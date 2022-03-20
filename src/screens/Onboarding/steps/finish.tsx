// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Flex, Icons, IconBoxList } from "@ledgerhq/native-ui";
import { LedgerLiveRegular } from "@ledgerhq/native-ui/assets/logos";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrackScreen } from "../../../analytics";
import { completeOnboarding } from "../../../actions/settings";
import { useNavigationInterceptor } from "../onboardingContext";
import { NavigatorName } from "../../../const";

import Button from "../../../components/wrappedUi/Button";

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.c60};
`;

const items = [
  {
    title: "buyDevice.0.title",
    desc: "buyDevice.0.desc",
    Icon: Icons.CrownMedium,
  },
  {
    title: "buyDevice.1.title",
    desc: "buyDevice.1.desc",
    Icon: Icons.LendMedium,
  },
  {
    title: "buyDevice.2.title",
    desc: "buyDevice.2.desc",
    Icon: Icons.ClaimRewardsMedium,
  },
  {
    title: "buyDevice.3.title",
    desc: "buyDevice.3.desc",
    Icon: Icons.NanoXAltMedium,
  },
];

type Props = {
  navigation: any;
};

export default function OnboardingStepFinish({ navigation }: Props) {
  const dispatch = useDispatch();
  const { resetCurrentStep } = useNavigationInterceptor();
  const { t } = useTranslation();

  function onFinish(): void {
    dispatch(completeOnboarding());
    resetCurrentStep();

    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.popToTop();
    }

    navigation.replace(NavigatorName.Base, {
      screen: NavigatorName.Main,
    });
  }

  return (
    <StyledSafeAreaView>
      <TrackScreen category="Onboarding" name="Finish" />
      <Flex flex={1} p={6} alignItems="center" justifyContent="center">
        <IconBoxList
          flex={1}
          items={items.map(item => ({
            Icon: item.Icon,
            title: t(item.title),
            description: t(item.desc),
          }))}
        />
      </Flex>
      <Button
        m={6}
        type="main"
        outline={false}
        event="BuyDeviceScreen - Buy Ledger"
        onPress={onFinish}
        size="large"
      >
        {t("onboarding.stepFinish.cta")}
      </Button>
    </StyledSafeAreaView>
  );
}
