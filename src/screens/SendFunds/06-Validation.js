/* @flow */
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import type {
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type { DeviceModelId } from "@ledgerhq/devices";
import { updateAccountWithUpdater } from "../../actions/accounts";
import { accountAndParentScreenSelectorCreator } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import PreventNativeBack from "../../components/PreventNativeBack";
import ValidateOnDevice from "../../components/ValidateOnDevice";
import SkipLock from "../../components/behaviour/SkipLock";
import { useSignWithDevice } from "../../logic/screenTransactionHooks";

const forceInset = { bottom: "always" };

interface RouteParams {
  accountId: string;
  deviceId: string;
  modelId: DeviceModelId;
  wired: boolean;
  transaction: Transaction;
  status: TransactionStatus;
}

interface Props {
  navigation: *;
  route: { params: RouteParams };
}

export default function Validation({ navigation, route }: Props) {
  const { account, parentAccount } = useSelector(
    accountAndParentScreenSelectorCreator(route),
  );
  const dispatch = useDispatch();
  const [signing, signed] = useSignWithDevice({
    context: "Send",
    account,
    parentAccount,
    navigation,
    updateAccountWithUpdater: (...args) =>
      dispatch(updateAccountWithUpdater(...args)),
  });

  const { status, transaction, modelId, wired } = route.params || {};

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="SendFunds" name="Validation" signed={signed} />
      {signing && (
        <>
          <PreventNativeBack />
          <SkipLock />
        </>
      )}

      {signed ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <ValidateOnDevice
          wired={wired}
          modelId={modelId}
          account={account}
          parentAccount={parentAccount}
          status={status}
          transaction={transaction}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  center: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
