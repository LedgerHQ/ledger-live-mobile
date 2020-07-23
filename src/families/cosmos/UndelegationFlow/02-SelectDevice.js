// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { StyleSheet, ScrollView } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { accountScreenSelector } from "../../../reducers/accounts";
import colors from "../../../colors";
import { ScreenName } from "../../../const";
import { TrackScreen } from "../../../analytics";
import SelectDevice from "../../../components/SelectDevice";

const forceInset = { bottom: "always" };

type RouteParams = {
  accountId: string,
  transaction: Transaction,
};

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

export default function ConnectDevice({ navigation, route }: Props) {
  const { account: accountLike, parentAccount } = useSelector(
    accountScreenSelector(route),
  );

  invariant(
    accountLike && accountLike.cosmosResources,
    "account and cosmos resources required",
  );

  const account = getMainAccount(accountLike, parentAccount);

  const { transaction, status } = useBridgeTransaction(() => {
    const transaction = route.params.transaction;

    return { account, transaction };
  });

  const onSelectDevice = useCallback(
    (device: Device) => {
      navigation.replace(ScreenName.CosmosUndelegationConnectDevice, {
        ...route.params,
        device,
        transaction,
        status,
        context: "CosmosUndelegation",
      });
    },
    [navigation, status, transaction, route.params],
  );

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <TrackScreen category="CosmosUndelegation" name="ConnectDevice" />
        <SelectDevice onSelect={onSelectDevice} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
});
