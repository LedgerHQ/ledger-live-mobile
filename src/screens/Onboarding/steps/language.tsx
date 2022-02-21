import React from "react";
import { ScrollView } from "react-native";
import { Trans } from "react-i18next";
import {
  Flex,
  SelectableList,
  IconBox,
  Icons,
  Text,
} from "@ledgerhq/native-ui";
import { StackScreenProps } from "@react-navigation/stack";
import i18next from "i18next";
import { useLocale } from "../../../context/Locale";
import { supportedLocales } from "../../../languages";
import Button from "../../../components/Button";
import { ScreenName } from "../../../const";
import { BluetoothMedium } from "@ledgerhq/native-ui/assets/icons";

const languages = {
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

function OnboardingStepLanguage({ navigation }: StackScreenProps<{}>) {
  const { locale: currentLocale } = useLocale();
  const changeLanguage = l => {
    i18next.changeLanguage(l);
  };

  const next = () => {
    navigation.navigate(ScreenName.OnboardingStepLanguageGetStarted);
  };

  return (
    <>
      <ScrollView>
        <Flex mb={4}>
          <SelectableList
            currentValue={currentLocale}
            onChange={changeLanguage}
          >
            {supportedLocales.map((l, index) => (
              <SelectableList.Element key={index + l} value={l}>
                <BluetoothMedium size={16} color={"neutral.c100"} />{" "}
                {languages[l]}
              </SelectableList.Element>
            ))}
          </SelectableList>
        </Flex>
      </ScrollView>
      <Button
        event="Onboarding - Language confirm"
        type="primary"
        onPress={next}
        outline={false}
        title={<Trans i18nKey="v3.onboarding.stepLanguage.cta" />}
      />
    </>
  );
}

export function OnboardingStepLanguageGetStarted({
  navigation,
}: StackScreenProps<{}>) {
  const next = () => {
    navigation.getParent()?.replace(ScreenName.OnboardingTermsOfUse);
  };

  return (
    <>
      <Flex flex={1} px={4} justifyContent="center" alignItems="center">
        <Flex mb={8}>
          <IconBox Icon={Icons.WarningMedium} />
        </Flex>
        <Text variant="large" mb={5} fontWeight="semiBold">
          <Trans i18nKey="v3.onboarding.stepLanguage.warning.title" />
        </Text>
        <Text variant="body" color="palette.neutral.c80" textAlign="center">
          <Trans i18nKey="v3.onboarding.stepLanguage.warning.desc" />
        </Text>
      </Flex>
      <Button
        type="primary"
        onPress={next}
        outline={false}
        title={<Trans i18nKey="v3.onboarding.stepLanguage.cta" />}
      />
    </>
  );
}

export default OnboardingStepLanguage;
