// @flow

import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { useTheme, useNavigation } from "@react-navigation/native";

import type {
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types/account";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import { getSwapSelectableCurrencies } from "@ledgerhq/live-common/lib/exchange/swap/logic";

import {
  swapKYCSelector,
  swapHasAcceptedIPSharingSelector,
} from "../../../reducers/settings";
import { setSwapSelectableCurrencies } from "../../../actions/settings";

import Landing from "./Landing";
import Providers from "../Providers";
import { ScreenName } from "../../../const";
import Form from "./Form";

const Swap = ({
  defaultAccount,
  defaultParentAccount,
}: {
  defaultAccount?: AccountLike,
  defaultParentAccount?: Account,
}) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const swapKYC = useSelector(swapKYCSelector);
  const hasAcceptedIPSharing = useSelector(swapHasAcceptedIPSharingSelector);
  const { navigate } = useNavigation();

  const [provider, setProvider] = useState();
  const [providers, setProviders] = useState<any>();
  const showWyreKYC =
    provider === "wyre" && swapKYC?.wyre?.status !== "approved";

  useEffect(() => {
    if (showWyreKYC) {
      // Navigate to the KYC step, separate screen to allow coming back here.
      setProvider("");
      navigate(ScreenName.SwapKYC, { provider });
    }
  }, [navigate, provider, showWyreKYC, swapKYC]);

  useEffect(() => {
    if (hasAcceptedIPSharing) {
      // FIXME I can't make flow happy here with the provider type
      getProviders().then((providers: any) => {
        dispatch(
          setSwapSelectableCurrencies(getSwapSelectableCurrencies(providers)),
        );
        setProviders(providers);
      });
    }
  }, [dispatch, hasAcceptedIPSharing]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {!hasAcceptedIPSharing ? (
        <Landing />
      ) : !providers ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : !provider ? (
        <Providers setProvider={setProvider} providers={providers} />
      ) : !showWyreKYC ? (
        <Form
          providers={providers}
          provider={provider}
          defaultAccount={defaultAccount}
          defaultParentAccount={defaultParentAccount}
        />
      ) : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectDevice: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 20,
  },
  debugText: {
    marginBottom: 10,
  },
});

export default Swap;
