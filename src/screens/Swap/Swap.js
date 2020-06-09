// @flow

import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";
import MissingSwapApp from "./MissingSwapApp";
import Landing from "./Landing";
import Form from "./Form";
import Connect from "./Connect";
import colors from "../../colors";

type MaybeProviders = ?(AvailableProvider[]);

// const litecoinAccount =
//   "libcore:1:litecoin:Ltub2Zx1tbqWB7AbC4fb7aWgsuyXBm2qt97gzG5av4PHAjdAhvdZQFHS7nmcScgtAvpgcGAkVQQvR9BXwu54ny6Yqwst4KQAnyD1Yx6VezNf1S8:segwit";
// const bitcoinAccount =
//   "libcore:1:bitcoin:xpub6DACJs4ZgE67HEu53j2osRtw51wfJybJ88ccVQnHpmjqr9XJfMYXn6Fxt3u772FonuWfqYUrb9Z9wxe2S9pTzxGDiQZDk1cMPiDH2S5HjYa:native_segwit";

const Swap = () => {
  const [providers, setProviders] = useState<MaybeProviders>();
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [installedApps, setInstalledApps] = useState();
  const { navigate } = useNavigation();
  const route = useRoute();

  console.log("wadus -2", { params: route.params });

  useEffect(() => {
    getProviders().then(setProviders);
  }, [setProviders]);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      const { installed } = data.appRes;
      setInstalledApps(installed);
    },
    [setInstalledApps],
  );

  const showInstallSwap =
    installedApps && !installedApps.some(a => a.name === "Bitcoin");
  // ↑ FIXME Use swap once we have swap app for real

  const onContinue = useCallback(() => {
    setShowLandingPage(false);
  }, [setShowLandingPage]);

  return (
    <View style={styles.root}>
      {showLandingPage ? (
        <Landing providers={providers} onContinue={onContinue} />
      ) : !installedApps ? (
        <Connect setResult={onSetResult} />
      ) : showInstallSwap ? (
        <MissingSwapApp />
      ) : (
        <Form installedApps={installedApps} providers={providers} />
      )}
      {/* <DeviceJob
            meta={{ ...result, modelId: "nanoX" }}
            deviceModelId="nanoX"
            steps={[
              connectingStep,
              initSwapStep({ exchange, exchangeRate: rate }),
            ]}
            onCancel={onCancel}
            onDone={onDone}
          /> */}
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
