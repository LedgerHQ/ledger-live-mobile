// @flow

import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { useTheme, useFocusEffect } from "@react-navigation/native";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import Button from "../../components/Button";
import { useProductTourFinishedModal } from "../ProductTour/Provider";
import IconArrowRight from "../../icons/ArrowRight";
import IconChevron from "../../icons/Chevron";
import { counterValueCurrencySelector } from "../../reducers/settings";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {};

export default function Contervalues({ navigation }: Props) {
  const { colors } = useTheme();
  const supportedCV = useSelector(counterValueCurrencySelector);
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
        <TrackScreen category="CustomizeApp" name="Countervalues" />
        <LText secondary style={styles.description}>
          <Trans i18nKey="customizeapp.countervalues.description" />
        </LText>
        <TouchableOpacity
          style={[styles.select, { borderColor: colors.live }]}
          onPress={() => {
            navigation.navigate(ScreenName.CustomizeAppCountervalueSettings);
          }}
        >
          <LText semiBold style={styles.selectValue}>
            {supportedCV.name} ({supportedCV.ticker})
          </LText>
          <IconChevron color={colors.fog} size={18} />
        </TouchableOpacity>
      </View>
      <View>
        <Button
          event="CustomizeAppCountervaluesContinue"
          containerStyle={styles.button}
          type="primary"
          title={<Trans i18nKey="customizeapp.countervalues.cta" />}
          onPress={primaryCTA}
        />
        <Button
          event="CustomizeAppCountervaluesSkip"
          onPress={secondaryCTA}
          type="lightSecondary"
          title={<Trans i18nKey="customizeapp.countervalues.skip" />}
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
