// @flow

import React, { useCallback, useContext, useState } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenName, NavigatorName } from "../../const";
import colors from "../../colors";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import Button from "../../components/Button";
import { context as _ptContext, completeStep } from "../ProductTour/Provider";
import ProductTourStepFinishedBottomModal from "../ProductTour/ProductTourStepFinishedBottomModal";
import { navigate } from "../../rootnavigation";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {};

export default function Contervalues({ navigation, route }: Props) {
  const ptContext = useContext(_ptContext);

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
    <View style={styles.root}>
      <TrackScreen category="CustomizeApp" name="Countervalues" />
      <ProductTourStepFinishedBottomModal
        isOpened={ptContext.currentStep === "CUSTOMIZE_APP" && done}
        onPress={() => goToProductTourMenu()}
        onClose={() => goToProductTourMenu()}
      />
      <LText secondary semiBold style={styles.title}>
        Countervalues
      </LText>
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
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  title: {
    marginTop: 32,
    fontSize: 18,
    color: colors.darkBlue,
  },
  button: {
    marginBottom: 16,
  },
});
