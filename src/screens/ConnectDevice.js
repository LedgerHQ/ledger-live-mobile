// @flow
import invariant from "invariant";
import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import type {
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { accountScreenSelector } from "../reducers/accounts";
import DeviceAction from "../components/DeviceAction";
import { useSignedTxHandler } from "../logic/screenTransactionHooks";
import { TrackScreen } from "../analytics";

const action = createAction(connectApp);

type Props = {
  navigation: any,
  route: {
    params: RouteParams,
    name: string,
  },
};

type RouteParams = {
  device: Device,
  accountId: string,
  transaction: Transaction,
  status: TransactionStatus,
};

export default function ConnectDevice({ route }: Props) {
  const { account: accountLike, parentAccount } = useSelector(
    accountScreenSelector(route),
  );
  invariant(accountLike, "account is required");
  const account = getMainAccount(accountLike, parentAccount);
  const [isInteracting, setIsInteracting] = useState(true);

  const { transaction, status } = useBridgeTransaction(() => ({
    account,
    transaction: route.params.transaction,
  }));

  const tokenCurrency =
    account.type === "TokenAccount" ? account.token : undefined;

  const handleTx = useSignedTxHandler({
    account,
    parentAccount,
  });

  const onResult = useCallback(
    async payload => {
      setIsInteracting(false);
      await handleTx(payload);
    },
    [handleTx],
  );

  if (!transaction) {
    return null;
  }

  return (
    <SafeAreaView style={styles.root}>
      <TrackScreen
        category={route.name.replace("ConnectDevice", "")}
        name="ConnectDevice"
      />
      {isInteracting && (
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
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
  },
});
