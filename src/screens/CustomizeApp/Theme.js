// @flow

import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import { themeSelector } from "../../reducers/settings";
import { setTheme } from "../../actions/settings";
import { TrackScreen } from "../../analytics";
import Button from "../../components/Button";
import LText from "../../components/LText";
import { useProductTourFinishedModal } from "../ProductTour/Provider";
import IconArrowRight from "../../icons/ArrowRight";

const themes = {
  dark: require("../../images/producttour/theme-dark.png"),
  dusk: require("../../images/producttour/theme-dusk.png"),
  light: require("../../images/producttour/theme-light.png"),
  "dark-selected": require("../../images/producttour/theme-dark-selected.png"),
  "dusk-selected": require("../../images/producttour/theme-dusk-selected.png"),
  "light-selected": require("../../images/producttour/theme-light-selected.png"),
};

export default function Theme() {
  const { colors } = useTheme();
  const theme = useSelector(themeSelector);
  const dispatch = useDispatch();
  const selectTheme = t => {
    dispatch(setTheme(t));
  };
  const [done, setDone] = useState(false);

  useFocusEffect(useCallback(() => setDone(false), [setDone]));

  const primaryCTA = useCallback(() => {
    setDone(true);
  }, []);

  const secondaryCTA = useCallback(() => {
    setDone(true);
  }, []);

  useProductTourFinishedModal("CUSTOMIZE_APP", done);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <TrackScreen category="CustomizeApp" name="Theme" />
        <View style={styles.themes}>
          <View>
            <TouchableOpacity onPress={() => selectTheme("dark")}>
              <Image
                style={styles.theme}
                source={themes[`dark${theme === "dark" ? "-selected" : ""}`]}
              />
            </TouchableOpacity>
            <LText bold style={styles.name}>
              <Trans i18nKey="customizeapp.theme.dark" />
            </LText>
          </View>
          <View style={styles.separator} />
          <View>
            <TouchableOpacity onPress={() => selectTheme("dusk")}>
              <Image
                style={styles.theme}
                source={themes[`dusk${theme === "dusk" ? "-selected" : ""}`]}
              />
            </TouchableOpacity>
            <LText bold style={styles.name}>
              <Trans i18nKey="customizeapp.theme.dusk" />
            </LText>
          </View>
          <View style={styles.separator} />
          <View>
            <TouchableOpacity onPress={() => selectTheme("light")}>
              <Image
                style={styles.theme}
                source={themes[`light${theme === "light" ? "-selected" : ""}`]}
              />
            </TouchableOpacity>
            <LText bold style={styles.name}>
              <Trans i18nKey="customizeapp.theme.light" />
            </LText>
          </View>
        </View>
      </View>
      <View>
        <Button
          event="CustomizeAppThemeContinue"
          containerStyle={styles.button}
          type="primary"
          title={<Trans i18nKey="customizeapp.theme.cta" />}
          onPress={primaryCTA}
        />
        <Button
          event="CustomizeAppThemeSkip"
          onPress={secondaryCTA}
          type="lightSecondary"
          title={<Trans i18nKey="customizeapp.theme.skip" />}
          IconRight={() => <IconArrowRight color={colors.live} size={20} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  themes: {
    flexDirection: "row",
  },
  theme: {
    height: 56,
    width: 56,
    marginBottom: 16,
  },
  name: {
    fontSize: 15,
    textAlign: "center",
  },
  separator: {
    width: 32,
  },
  description: {
    marginTop: 24,
    fontSize: 13,
    marginBottom: 16,
  },
  select: {
    paddingHorizontal: 19,
    paddingVertical: 17,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 4,
    borderWidth: 1,
  },
  selectValue: {
    fontSize: 18,
  },
  button: {
    marginBottom: 16,
  },
});
