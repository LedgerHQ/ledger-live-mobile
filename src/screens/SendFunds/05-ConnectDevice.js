// @flow
import React, { useCallback } from "react";
import SafeAreaView from "react-native-safe-area-view";
import { UserRefusedOnDevice } from "@ledgerhq/errors";
import type {
  Account,
  AccountLike,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/transaction";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { ScreenName } from "../../const";
import DeviceAction from "../../components/DeviceAction";
import LText from "../../components/LText";

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

  const onResult = useCallback(
    ({ signedOperation, transactionSignError }) => {
      if (transactionSignError) {
        navigation.replace(ScreenName.SendValidationError, {
          error:
            transactionSignError.name === "TransactionRefusedOnDevice"
              ? new UserRefusedOnDevice()
              : transactionSignError,
        });
        return;
      }

      try {
        // await broadcasting tx
        navigation.replace(ScreenName.SendValidationSuccess, {
          result: signedOperation.operation,
        });
        // updateAccountWithUpdater(mainAccount.id, account =>
        //   addPendingOperation(account, e.operation),
        // );
      } catch (error) {}
    },
    [navigation],
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        Result={Validation}
      />
    </SafeAreaView>
  );
}

function Validation(props) {
  return (
    <>
      <LText>Validate Transaction</LText>
      <LText>{JSON.stringify(props, null, 2)}</LText>
    </>
  );
}
