/* @flow */
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { themeSelector } from "../../../reducers/settings";
import SettingsRow from "../../../components/SettingsRow";
import LText from "../../../components/LText";
import BottomModal from "../../../components/BottomModal";
import { setTheme } from "../../../actions/settings";

export default function ThemeSettingsRow() {
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();

  const selectTheme = t => () => {
    dispatch(setTheme(t));
    setIsOpen(false);
  };

  return (
    <>
      <SettingsRow
        event="ThemeSettingsRow"
        title={<Trans i18nKey="settings.display.theme" />}
        desc={<Trans i18nKey="settings.display.themeDesc" />}
        arrowRight
        onPress={() => setIsOpen(true)}
        alignedTop
      >
        <LText semiBold color="grey">
          {theme}
        </LText>
      </SettingsRow>
      <BottomModal isOpened={isOpen}>
        {["light", "dusk", "dark"].map((t, i) => (
          <TouchableOpacity
            key={t + i}
            onPress={selectTheme(t)}
            style={styles.button}
          >
            <LText semiBold color="darkBlue" style={[styles.buttonLabel]}>
              {t}
            </LText>
          </TouchableOpacity>
        ))}
      </BottomModal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    margin: 8,
    borderRadius: 4,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 16,
  },
});
