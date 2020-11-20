// @flow

import React, { useCallback } from "react";
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Trans } from "react-i18next";
import i18next from "i18next";
import { TrackScreen } from "../../../analytics";
import Button from "../../../components/Button";
import colors from "../../../colors";
import LText from "../../../components/LText";
import CheckBox from "../../../components/CheckBox";
import { useLocale } from "../../../context/Locale";
import { localeIds } from "../../../languages";
import { ScreenName } from "../../../const";

function OnboardingStepLanguage({ navigation }: *) {
  const next = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingTermsOfUse);
  }, [navigation]);
  const { locale: currentLocale } = useLocale();

  const changeLanguage = useCallback(l => i18next.changeLanguage(l), []);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.white }]}>
      <TrackScreen category="Onboarding" name="Language" />
      <LText semiBold style={styles.title}>
        <Trans i18nKey="onboarding.stepLanguage.title" />
      </LText>
      <View style={styles.localeContainer}>
        {localeIds.map((l, index) => (
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
            <LText semiBold style={styles.localeButtonLabel}>
              <Trans i18nKey={`onboarding.stepLanguage.${l}`} />
            </LText>
          </TouchableOpacity>
        ))}
      </View>
      <Button
        type="primary"
        onPress={next}
        title={<Trans i18nKey="onboarding.stepLanguage.cta" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
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
