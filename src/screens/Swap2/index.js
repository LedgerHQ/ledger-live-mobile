// @flow
import { useTheme, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Config from "react-native-config";
import { useSelector, useDispatch } from "react-redux";
import { setSwapSelectableCurrencies } from "../../actions/settings";
import LText from "../../components/LText";
import { ScreenName } from "../../const";
import { swapKYCSelector } from "../../reducers/settings";
import { useSwapProviders } from "./react";
import type { SwapProviders } from "./types";

export default function SwapEntrypoint() {
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const setCurrencies = useCallback(
    currencies => {
      dispatch(setSwapSelectableCurrencies(currencies));
    },
    [dispatch],
  );

  const state = useSwapProviders({
    disabledProviders: Config.SWAP_DISABLED_PROVIDERS || "",
    setCurrencies,
  });

  useRedirectEffect(state);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      <LText>{JSON.stringify(state, null, 2)}</LText>
    </SafeAreaView>
  );
}

function useRedirectEffect({ providers, provider }: SwapProviders) {
  const navigation = useNavigation();
  const route = useRoute();
  const swapKYC = useSelector(swapKYCSelector);

  useEffect(() => {
    if (!providers?.length || !provider) return;

    if (provider === "wyre" && swapKYC?.wyre?.status !== "approved") {
      navigation.replace(ScreenName.SwapKYC, { provider });
      return;
    }

    navigation.replace(ScreenName.SwapFormOrHistory, {
      providers,
      provider,
      defaultAccount: route?.params?.defaultAccount,
      defaultParentAccount: route?.params?.defaultParentAccount,
    });
  }, [navigation, route, provider, providers, swapKYC]);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
