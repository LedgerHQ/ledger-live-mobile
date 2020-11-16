/* @flow */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import ValidateError from "../../components/ValidateError";
import { NavigatorName, ScreenName } from "../../const";
import { urls } from "../../config/urls";
import { context as _wcContext } from "../WalletConnect/Provider";

const forceInset = { bottom: "always" };

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  parentId: String,
  message: any,
  error: Error,
};

export default function ValidationError({ navigation, route }: Props) {
  const error = route.params.error;
  const wcContext = useContext(_wcContext);
  const [disableRetry, setDisableRetry] = useState(false);

  useEffect(() => {
    if (wcContext.currentCallRequestId) {
      setDisableRetry(true);
      wcContext.setCurrentCallRequestError(error);
    }
  }, []);

  const onClose = useCallback(() => {
    navigation.dangerouslyGetParent().pop();
  }, [navigation]);

  const contactUs = useCallback(() => {
    Linking.openURL(urls.contact);
  }, []);

  const retry = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="SignMessage" name="ValidationError" />
      <ValidateError
        error={error}
        onRetry={!disableRetry && retry}
        onClose={onClose}
        onContactUs={contactUs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
