// @flow
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/startExchange";
import startExchange from "@ledgerhq/live-common/lib/exchange/platform/startExchange";
import DeviceActionModal from "../../../components/DeviceActionModal";
import SelectDevice from "../../../components/SelectDevice";

type Result = {
  startExchangeResult?: number,
  startExchangeError?: Error,
};

export default function PlatformStartExchange({
  route,
}: {
  route: {
    params: {
      request: { exchangeType: number },
      onResult: (result: Result) => void,
    },
  },
}) {
  const [device, setDevice] = useState(null);

  return (
    <SafeAreaView style={styles.root}>
      <SelectDevice onSelect={setDevice} autoSelectOnAdd />
      <DeviceActionModal
        device={device}
        action={action}
        onResult={route.params.onResult}
        request={route.params.request}
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
