// @flow

import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager,
} from "react-native";
import { Trans } from "react-i18next";
import i18next from "i18next";
import { useTheme } from "@react-navigation/native";
import RNRestart from "react-native-restart";
import { TrackScreen } from "../../../analytics";
import Button from "../../../components/Button";
import LText from "../../../components/LText";
import CheckBox from "../../../components/CheckBox";
import { useLocale } from "../../../context/Locale";
import { supportedLocales } from "../../../languages";

const languages = {
  ar: "عربى",
  de: "Deutsch",
  el: "Ελληνικά",
  en: "English",
  es: "Español",
  fi: "suomi",
  fr: "Français",
  hu: "magyar",
  it: "italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  no: "Norsk",
  pl: "polski",
  pt: "português",
  ru: "Русский",
  sr: "српски",
  sv: "svenska",
  tr: "Türkçe",
  zh: "简体中文",
};

function OnboardingStepLanguage({ navigation }: *) {
  const { colors } = useTheme();
  const next = useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const { locale: currentLocale } = useLocale();

  const confirmLanguageChange = useCallback(async l => {
    await i18next.changeLanguage(l);

    I18nManager.forceRTL(true);
    RNRestart.Restart();
  }, []);

  const changeLanguage = useCallback(
    async l => {
      const newDir = i18next.dir(l);
      const currentDir = I18nManager.isRTL ? "rtl" : "ltr";

      if (newDir !== currentDir) {
        Alert.alert(
          "Restart required",
          "The selected language requires the application to restart. Are you sure you want to continue?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => confirmLanguageChange(l),
            },
          ],
        );
      } else {
        await i18next.changeLanguage(l);

        next();
      }
    },
    [next, confirmLanguageChange],
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.wrapper]}>
        <TrackScreen category="Onboarding" name="Language" />
        <LText semiBold style={styles.title}>
          <Trans i18nKey="onboarding.stepLanguage.title" />
        </LText>
        <ScrollView style={styles.localeContainer}>
          {supportedLocales.map((l, index) => (
            <TouchableOpacity
              key={index + l}
              onPress={() => changeLanguage(l)}
              style={[
                styles.localeButton,
                {
                  borderColor: l === currentLocale ? colors.live : colors.fog,
                },
              ]}
            >
              <CheckBox isChecked={l === currentLocale} />
              <LText
                semiBold={l !== "ar"}
                bold={l === "ar"}
                style={styles.localeButtonLabel}
                preferredFontFamily={l === "ar" ? "Cairo" : "Inter"}
              >
                {languages[l]}
              </LText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Button
          event="Onboarding - Language confirm"
          type="primary"
          onPress={next}
          title={<Trans i18nKey="onboarding.stepLanguage.cta" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 16,
    marginBottom: 16,
  },
  languageLabel: { fontSize: 10, marginRight: 8 },
  localeContainer: {
    flex: 1,
  },
  localeButton: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    marginVertical: 8,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  localeButtonLabel: { fontSize: 18, marginLeft: 10 },
});

export default OnboardingStepLanguage;
