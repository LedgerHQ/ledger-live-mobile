// @flow
import React from "react";
import { StyleSheet } from "react-native";
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
import DeviceAction from "../../components/DeviceAction";
import { useSignedTxHandler } from "../../logic/screenTransactionHooks";

const action = createAction(connectApp);

type Props = {
  navigation: any,
  route: {
    params: RouteParams,
  },
};

type RouteParams = {
  device: Device,
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  status: TransactionStatus,
};

export default function ConnectDevice({ route }: Props) {
  const { account, parentAccount, transaction, status } = route.params;
  const tokenCurrency =
    account.type === "TokenAccount" ? account.token : undefined;

  const onResult = useSignedTxHandler({
    context: "Send",
    account,
    parentAccount,
  });

  return (
    <SafeAreaView style={styles.root}>
      <DeviceAction
        action={action}
        request={{
          account,
          parentAccount,
          transaction,
          status,
          tokenCurrency,
        }}
        device={route.params.device}
        onResult={onResult}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
