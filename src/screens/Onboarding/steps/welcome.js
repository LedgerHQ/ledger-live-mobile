// @flow

import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Linking,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Trans } from "react-i18next";

import { TrackScreen } from "../../../analytics";
import Touchable from "../../../components/Touchable";
import LText from "../../../components/LText";
import Button from "../../../components/Button";
import ArrowDown from "../../../icons/Chevron";
import colors from "../../../colors";
import { urls } from "../../../config/urls";
import { deviceNames } from "../../../wording";

import commonStyles from "../styles";

import welcomeLogo from "../assets/welcome.png";
import { useLocale } from "../../../context/Locale";
import { ScreenName } from "../../../const";

const hitSlop = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

function OnboardingStepWelcome({ navigation }: *) {
  const buy = useCallback(() => Linking.openURL(urls.buyNanoX), []);
  const next = useCallback(
    () => navigation.navigate(ScreenName.OnboardingLanguage),
    [navigation],
  );

  const { locale } = useLocale();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.white }]}>
      <TrackScreen category="Onboarding" name="Welcome" />
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.languageButton, { borderColor: colors.fog }]}
          onPress={next}
        >
          <LText semiBold style={styles.languageLabel}>
            {locale}
          </LText>
          <ArrowDown size={10} color={colors.darkBlue} />
        </TouchableOpacity>
      </View>
      <View style={styles.logo}>
        <Image style={styles.bgImage} resizeMode="cover" source={welcomeLogo} />
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.titleSection}>
          <LText bold style={styles.title}>
            <Trans i18nKey="onboarding.stepWelcome.title" />
          </LText>
          <LText style={[styles.subTitle, styles.subTitlePadding]}>
            <Trans i18nKey="onboarding.stepWelcome.subtitle" />
          </LText>
        </View>

        <Button
          type="primary"
          onPress={next}
          title={<Trans i18nKey="onboarding.stepWelcome.start" />}
        />
        <View style={commonStyles.footer}>
          <LText style={styles.subTitle}>
            <Trans i18nKey="onboarding.stepWelcome.noDevice" />
          </LText>
          <Touchable
            event="WelcomeBuy"
            onPress={buy}
            style={styles.buyTouch}
            hitSlop={hitSlop}
          >
            <LText
              semiBold
              style={[styles.subTitle, styles.buy, { color: colors.live }]}
            >
              <Trans
                i18nKey="onboarding.stepWelcome.buy"
                values={deviceNames.nanoX}
              />
            </LText>
          </Touchable>
        </View>
      </View>
    </SafeAreaView>
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
  },
  bgImage: {
    width: "100%",
    height: "90%",
    position: "absolute",
    top: -100,
    left: 0,
    zIndex: -1,
  },
  logo: {
    flex: 2,
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
  bottomSection: { flex: 1, padding: 24, justifyContent: "flex-end" },
  titleSection: { flex: 1, justifyContent: "flex-start" },
  title: {
    color: colors.darkBlue,
    fontSize: 28,
    textAlign: "center",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 13,
    color: colors.grey,
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
