/* @flow */
import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { Trans } from "react-i18next";
import colors from "../../colors";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import Button from "../../components/Button";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

export type RouteParams = {
  accountId: string,
  message: *, // TOCHANGE
  currentNavigation?: string,
  nextNavigation?: string,
};

const defaultParams = {
  currentNavigation: ScreenName.SignSummary,
  nextNavigation: ScreenName.SignSelectDevice,
};

function SignSummary({ navigation, route: initialRoute }: Props) {
  const route = {
    ...initialRoute,
    params: { ...defaultParams, ...initialRoute.params },
  };
  const { nextNavigation } = route.params;

  const navigateToNext = useCallback(() => {
    navigation.navigate(nextNavigation, {
      ...route.params,
    });
  }, [navigation, nextNavigation, route.params]);

  const onContinue = useCallback(() => {
    navigateToNext();
  }, [navigateToNext]);

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="SignMessage" name="Summary" />
      <View style={styles.body} />
      <View style={styles.footer}>
        <Button
          event="SummaryContinue"
          type="primary"
          title={<Trans i18nKey="common.continue" />}
          containerStyle={styles.continueButton}
          onPress={onContinue}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: "column",
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  continueButton: {
    alignSelf: "stretch",
  },
});

export default SignSummary;
