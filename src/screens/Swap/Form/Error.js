// @flow

import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Trans } from "react-i18next";
import colors from "../../../colors";
import GenericErrorView from "../../../components/GenericErrorView";
import Button from "../../../components/Button";
import { ScreenName } from "../../../const";

const Error = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const onRetry = useCallback(() => {
    navigation.navigate(ScreenName.SwapForm);
  }, [navigation]);

  const { error } = route.params;
  return (
    <View style={styles.root}>
      <View style={styles.wrapper}>
        <GenericErrorView error={error} />
      </View>
      <Button
        type={"primary"}
        onPress={onRetry}
        title={<Trans i18nKey="common.retry" />}
        event={"SwapErrorRetry"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
});

export default Error;
