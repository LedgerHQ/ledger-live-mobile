// @flow

import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { useTheme, useNavigation } from "@react-navigation/native";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import { getSwapSelectableCurrencies } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import Config from "react-native-config";

import {
  swapKYCSelector,
  swapHasAcceptedIPSharingSelector,
} from "../../reducers/settings";
import { setSwapSelectableCurrencies } from "../../actions/settings";
import useManifests from "./manifests";
import Landing from "./FormOrHistory/Landing";
import Providers from "./Providers";
import { ScreenName } from "../../const";

const initialSwapProviders = ["paraswap"]; // Nb manifest?

const SwapEntrypoint = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const manifests = useManifests();
  const swapKYC = useSelector(swapKYCSelector);
  const hasAcceptedIPSharing = useSelector(swapHasAcceptedIPSharingSelector);
  const { navigate } = useNavigation();

  const [providers, setProviders] = useState<any>();
  const [enabledProviders, setEnabledProviders] = useState<any>();

  useEffect(() => {
    if (hasAcceptedIPSharing) {
      getProviders().then((providers: any) => {
        // TODO consider simplifying this before merge.
        // FIXME I can't make flow happy here with the provider type
        dispatch(
          setSwapSelectableCurrencies(getSwapSelectableCurrencies(providers)),
        );
        let enabledProviders = [...initialSwapProviders];
        const disabledProviders = Config.SWAP_DISABLED_PROVIDERS || "";
        providers.forEach(({ provider }) => {
          if (!disabledProviders.includes(provider))
            enabledProviders.push(provider);
        });
        if (
          enabledProviders.includes("wyre") &&
          enabledProviders.includes("changelly")
        ) {
          enabledProviders = enabledProviders.filter(p => p !== "wyre");
        }
        if (__DEV__ && Config.DEBUG_PLATFORM) enabledProviders.push("debug");

        setEnabledProviders(enabledProviders);
        setProviders(providers);
      });
    }
  }, [dispatch, hasAcceptedIPSharing, providers]);

  const onContinue = useCallback(
    (provider: string, isDapp: boolean) => {
      const showWyreKYC =
        provider === "wyre" && swapKYC?.wyre?.status !== "approved";
      if (showWyreKYC) {
        navigate(ScreenName.SwapKYC, { provider });
      } else if (isDapp && manifests[provider]) {
        const manifest = manifests[provider];
        navigate(ScreenName.SwapDapp, { manifest });
      } else {
        // FIXME we are losing the defaultCurrency/app?
        navigate(ScreenName.SwapFormOrHistory, { providers, provider });
      }
    },
    [manifests, navigate, providers, swapKYC],
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {!hasAcceptedIPSharing ? (
        <Landing />
      ) : !enabledProviders ? (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      ) : (
        <Providers onContinue={onContinue} providers={enabledProviders} />
      )}
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

export default SwapEntrypoint;
