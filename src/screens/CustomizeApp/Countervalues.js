// @flow

import React, { useCallback, useContext, useState } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { ScreenName, NavigatorName } from "../../const";
import colors from "../../colors";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import Button from "../../components/Button";
import { context as _ptContext, completeStep } from "../ProductTour/Provider";
import ProductTourStepFinishedBottomModal from "../ProductTour/ProductTourStepFinishedBottomModal";
import { navigate } from "../../rootnavigation";
import IconArrowRight from "../../icons/ArrowRight";
import IconChevron from "../../icons/Chevron";
import { counterValueCurrencySelector } from "../../reducers/settings";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {};

export default function Contervalues({ navigation, route }: Props) {
  const ptContext = useContext(_ptContext);
  const supportedCV = useSelector(counterValueCurrencySelector);

  const primaryCTA = useCallback(() => {
    setDone(true);
  }, []);

  const secondaryCTA = useCallback(() => {
    setDone(true);
  }, []);

  const [done, setDone] = useState(false);
  const goToProductTourMenu = () => {
    // $FlowFixMe
    completeStep(ptContext.currentStep);
    navigate(NavigatorName.ProductTour, {
      screen: ScreenName.ProductTourMenu,
    });
    setDone(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ProductTourStepFinishedBottomModal
        isOpened={ptContext.currentStep === "CUSTOMIZE_APP" && done}
        onPress={() => goToProductTourMenu()}
        onClose={() => goToProductTourMenu()}
      />
      <View style={styles.content}>
        <TrackScreen category="CustomizeApp" name="Countervalues" />
        <LText secondary style={styles.description}>
          <Trans i18nKey="customizeapp.countervalues.description" />
        </LText>
        <TouchableOpacity
          style={styles.select}
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
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
  },
  description: {
    marginTop: 24,
    fontSize: 13,
    color: colors.darkBlue,
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
    borderColor: colors.live,
  },
  selectValue: {
    fontSize: 18,
    color: colors.darkBlue,
  },
  button: {
    marginBottom: 16,
  },
});
