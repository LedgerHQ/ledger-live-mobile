// @flow

import React, { useCallback } from "react";
import { StyleSheet, View, Linking, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";

import { useTheme } from "@react-navigation/native";
import { Flex } from "@ledgerhq/native-ui";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import { urls } from "../../../config/urls";
import ArrowDown from "../../../icons/Chevron";

import { useLocale } from "../../../context/Locale";

import commonStyles from "../styles";

import { ScreenName } from "../../../const";

function OnboardingStepWelcome({ navigation }: any) {
  const { colors } = useTheme();
  const buy = useCallback(() => Linking.openURL(urls.buyNanoX), []);

  const next = useCallback(
    () => navigation.navigate(ScreenName.OnboardingTermsOfUse),
    [navigation],
  );

  const onLanguageSelect = useCallback(
    () => navigation.navigate(ScreenName.OnboardingLanguage),
    [navigation],
  );

  const { locale } = useLocale();

  return (
    <Flex flex={1}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.languageButton, { borderColor: colors.fog }]}
          onPress={onLanguageSelect}
        >
          <LText>{locale}</LText>
          <ArrowDown size={10} color={colors.darkBlue} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.titleSection}>
          <LText type="h1" bold>
            <Trans i18nKey="onboarding.stepWelcome.title" />
          </LText>
          <LText type="h3" color="grey">
            <Trans i18nKey="onboarding.stepWelcome.subtitle" />
          </LText>
        </View>

        <Button
          type="main"
          event="Onboarding - Start"
          onPress={next}
          title={<Trans i18nKey="onboarding.stepWelcome.start" />}
        />
      </View>
    </Flex>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 0,
  },
  header: {
    ...commonStyles.header,
    backgroundColor: "transparent",
    flexDirection: "row-reverse",
    zIndex: 10,
  },
  bgImage: {
    width: "100%",
    height: "120%",
    position: "absolute",
    top: -100,
    left: 0,
    zIndex: -10,
  },
  bgImageLayer: {
    width: "105%",
    height: "120%",
    position: "absolute",
    top: -100,
    left: "-5%",
  },
  bgImageLayer1: {
    zIndex: -9,
  },
  bgImageLayer2: {
    zIndex: -8,
  },
  bgImageLayer3: {
    zIndex: -7,
  },
  logo: {
    flex: 1,
    padding: 0,
  },
  languageButton: {
    paddingHorizontal: 16,
    borderRadius: 32,
    height: 34,
    width: "auto",
    flexDirection: "row",
    borderWidth: 1,
    alignItems: "center",
  },
  languageLabel: { fontSize: 10, marginRight: 8, textTransform: "uppercase" },
  bottomSection: { flex: 1, padding: 24, justifyContent: "flex-start" },
  titleSection: { flex: 1, justifyContent: "center" },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
  },
  subTitlePadding: { paddingHorizontal: 60 },
  sub: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buy: {
    marginLeft: 5,
  },
  buyTouch: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default OnboardingStepWelcome;
