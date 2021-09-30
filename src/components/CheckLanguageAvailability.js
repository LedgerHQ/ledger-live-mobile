// @flow

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { Text, View } from "react-native";
import Locale from "react-native-locale";
import { useTheme } from "@react-navigation/native";
import i18next from "i18next";

import BottomModal from "./BottomModal";
import Button from "./Button";
import Circle from "./Circle";
import ModalBottomAction from "./ModalBottomAction";
import LanguageIcon from "../icons/Language";
import { languageSelector } from "../reducers/settings";
import { languages, pushedLanguages } from "../languages";
import { useLanguageAvailableChecked } from "../context/Locale";

export default function CheckLanguageAvailability() {
  const { colors } = useTheme();
  const [modalOpened, setModalOpened] = useState(true);
  const { localeIdentifier } = Locale.constants();
  const osLanguage = localeIdentifier.split("_")[0];
  const currAppLanguage = useSelector(languageSelector);
  const [hasAnswered, answer] = useLanguageAvailableChecked();

  const toShow =
    modalOpened &&
    !hasAnswered &&
    currAppLanguage !== osLanguage &&
    pushedLanguages.includes(osLanguage);

  if (!toShow) {
    return null;
  }

  const onRequestClose = () => {
    setModalOpened(false);
  };

  const dontSwitchLanguage = () => {
    answer();
    onRequestClose();
  };

  const switchLanguage = () => {
    i18next.changeLanguage(osLanguage);
    answer();
    onRequestClose();
  };

  return (
    <BottomModal
      id="CheckLanguageAvailabilityModal"
      isOpened
      onClose={onRequestClose}
    >
      <ModalBottomAction
        title={<Trans i18nKey="systemLanguageAvailable.title" />}
        icon={
          <Circle bg={colors.lightLive} size={70}>
            <LanguageIcon size={40} color={colors.live} />
          </Circle>
        }
        description={
          <Trans i18nKey="systemLanguageAvailable.description.newSupport" />
        }
        footer={
          <View>
            <Button
              type="primary"
              event={`Discoverability - Switch - ${osLanguage}`}
              eventProperties={{ language: osLanguage }}
              title={
                <>
                  <Trans i18nKey="systemLanguageAvailable.switchButton" />
                  <Text> {languages[osLanguage]}</Text>
                </>
              }
              onPress={switchLanguage}
            />
            <Button
              type="secondary"
              outline={false}
              event={`Discoverability - Denied - ${osLanguage}`}
              eventProperties={{ language: osLanguage }}
              title={<Trans i18nKey="systemLanguageAvailable.no" />}
              onPress={dontSwitchLanguage}
            />
          </View>
        }
      />
    </BottomModal>
  );
}
