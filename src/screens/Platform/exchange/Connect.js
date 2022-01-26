// @flow
import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/startExchange";
import startExchange from "@ledgerhq/live-common/lib/exchange/platform/startExchange";
import DeviceActionModal from "../../../components/DeviceActionModal";
import SelectDevice from "../../../components/SelectDevice";

export default function PlatformExchangeConnect({
  navigation,
  route,
}: {
  navigation: any,
  route: {
    params: { exchangeType: number, onSuccess: (nounce: number) => void },
  },
}) {
  const [device, setDevice] = useState(null);

  const onResult = useCallback(
    (data: { startExchangeResult: number }) => {
      route.params.onSuccess(data.startExchangeResult);
      navigation.goBack();
    },
    [route, navigation],
  );

  return (
    <SafeAreaView style={styles.root}>
      <SelectDevice onSelect={setDevice} autoSelectOnAdd />
      <DeviceActionModal
        onClose={setDevice}
        device={device}
        action={action}
        onResult={onResult}
        request={{ exchangeType: route.params.exchangeType }}
      />
    </SafeAreaView>
  );
}

const action = createAction(connectApp, startExchange);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 32,
  },
});
