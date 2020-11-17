// @flow

import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import Touchable from "../../components/Touchable";
import LText from "../../components/LText";
import IconArrowLeft from "../../icons/ArrowLeft";
import HelpLink from "../../components/HelpLink";
import { useNavigationInterceptor } from "./onboardingContext";
import getStep from "./steps";
import { deviceNames } from "../../wording";
import type { OnboardingStepProps } from "./types";

type Props = OnboardingStepProps & {
  stepId: string,
  withSkip?: boolean,
  withNeedHelp?: boolean,
  titleOverride?: string,
};

const hitSlop = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

export default function OnboardingHeader({
  stepId,
  withSkip,
  withNeedHelp,
  titleOverride,
}: Props) {
  const { colors } = useTheme();
  const { next, prev, mode, firstTimeOnboarding } = useNavigationInterceptor();
  const { t } = useTranslation();

  const steps = firstTimeOnboarding && getStep(mode, firstTimeOnboarding);
  const visibleSteps = steps ? steps.filter(s => !s.isGhost) : [];
  const indexInSteps = visibleSteps.findIndex(s => s.id === stepId);
  const stepMsg = t("onboarding.stepCount", {
    current: indexInSteps + 1,
    total: visibleSteps.length,
  });

  let stepIdOverride = stepId;
  if (mode === "restore" && stepId === "OnboardingStepWriteRecovery") {
    stepIdOverride = "OnboardingStepWriteRecoveryRestore";
  }

  return (
    <View style={styles.root}>
      <View style={styles.headerHeader}>
        <Touchable
          event="OnboardingBack"
          style={[styles.arrow, { backgroundColor: colors.lightFog }]}
          onPress={prev}
          hitSlop={hitSlop}
        >
          <IconArrowLeft size={16} color={colors.grey} />
        </Touchable>
        {withSkip && (
          <Touchable event="OnboardingSkip" onPress={next} hitSlop={hitSlop}>
            <LText style={styles.skip} semiBold color="grey">
              {t("common.skip")}
            </LText>
          </Touchable>
        )}
        {withNeedHelp && <HelpLink />}
      </View>
      <LText semiBold style={styles.steps} color="grey">
        {stepMsg}
      </LText>
      <LText secondary semiBold style={styles.title}>
        {titleOverride ||
          t(`onboarding.stepsTitles.${stepIdOverride}`, deviceNames.nanoX)}
      </LText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
  },
  arrow: {
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  steps: {
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    lineHeight: 36,
  },
  headerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  skip: {
    fontSize: 16,
  },
});
