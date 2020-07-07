// @flow
import React from "react";
import SafeAreaView from "react-native-safe-area-view";
import { Observable } from "rxjs";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import DeviceAction from "./DeviceAction";

const connectAppExec = command("connectApp");
const action = createAction(connectAppExec);

type Props = {
  route: { params: { device: Device, account: Account } },
};

export default function ConnectDevice({ route }: Props) {
  const { account, parentAccount, transaction } = route.params;
  const tokenCurrency =
    account && account.type === "TokenAccount" && account.token;

  return (
    <SafeAreaView>
      <DeviceAction
        action={action}
        request={{
          tokenCurrency,
          parentAccount,
          account,
          transaction,
          // status,
        }}
        device={route.params.device}
      />
    </SafeAreaView>
  );
}

function command() {
  return () => Observable.create();
}
