/* @flow */
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import SafeAreaView from "react-native-safe-area-view";
import { withTranslation } from "react-i18next";
import type {
  AccountLike,
  Account,
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import type { DeviceModelId } from "@ledgerhq/devices";
import { updateAccountWithUpdater } from "../../actions/accounts";
import { accountAndParentScreenSelector } from "../../reducers/accounts";
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
  account: AccountLike;
  parentAccount: ?Account;
  updateAccountWithUpdater: (string, (Account) => Account) => void;
  navigation: *;
  route: { params: RouteParams };
}

const Validation = ({
  account,
  parentAccount,
  navigation,
  route,
  updateAccountWithUpdater,
}: Props) => {
  const [signing, signed] = useSignWithDevice({
    context: "Send",
    account,
    parentAccount,
    navigation,
    updateAccountWithUpdater,
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
};

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

const mapStateToProps = accountAndParentScreenSelector;

const mapDispatchToProps = {
  updateAccountWithUpdater,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Validation));
