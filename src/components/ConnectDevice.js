// @flow
import React, { useCallback } from "react";
import SafeAreaView from "react-native-safe-area-view";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { ScreenName } from "../const";
import DeviceAction from "./DeviceAction";

const action = createAction(connectApp);

type Props = {
  navigation: any,
  route: {
    params: RouteParams,
  },
};

type RouteParams = {
  device: Device,
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  status: TransactionStatus,
};

export default function ConnectDevice({ navigation, route }: Props) {
  const { account, parentAccount, transaction, status } = route.params;
  const tokenCurrency =
    account && account.type === "TokenAccount" && account.token;

  const onResult = useCallback(() => {
    navigation.navgate(ScreenName.SendValidation);
  }, [navigation]);

  return (
    <SafeAreaView>
      <DeviceAction
        action={action}
        request={{
          tokenCurrency,
          parentAccount,
          account,
          transaction,
          status,
        }}
        device={route.params.device}
        onResult={onResult}
      />
    </SafeAreaView>
  );
}
