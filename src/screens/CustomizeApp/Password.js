// @flow

import React, { useCallback, useContext } from "react";
import { Trans } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenName } from "../../const";
import colors from "../../colors";
import { TrackScreen } from "../../analytics";
import LText from "../../components/LText";
import Button from "../../components/Button";
import { context as _ptContext } from "../ProductTour/Provider";

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {};

export default function AddAccountsSuccess({ navigation, route }: Props) {
  const ptContext = useContext(_ptContext);

  const primaryCTA = useCallback(() => {
    navigation.navigate(ScreenName.CustomizeAppCountervalues);
  }, [navigation]);

  const secondaryCTA = useCallback(() => {
    navigation.navigate(ScreenName.CustomizeAppCountervalues);
  }, [navigation]);

  return (
    <View style={styles.root}>
      <TrackScreen category="CustomizeApp" name="Password" />
      <LText secondary semiBold style={styles.title}>
        Password
      </LText>
      <View>
        <Button
          event="CustomizeAppPasswordContinue"
          containerStyle={styles.button}
          type="primary"
          title={<Trans i18nKey="customizeapp.password.cta" />}
          onPress={primaryCTA}
        />
        <Button
          event="CustomizeAppPasswordSkip"
          onPress={secondaryCTA}
          type="lightSecondary"
          title={<Trans i18nKey="customizeapp.password.skip" />}
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
