// @flow
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import type {
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { accountAndParentScreenSelectorCreator } from "../../reducers/accounts";
import colors from "../../colors";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import SelectDevice from "../../components/SelectDevice";
import { connectingStep, accountApp } from "../../components/DeviceJob/steps";

const forceInset = { bottom: "always" };

interface RouteParams {
  accountId: string;
  transaction: Transaction;
  status: TransactionStatus;
}

interface Props {
  navigation: *;
  route: { params: RouteParams };
}

export default function ConnectDevice({ navigation, route }: Props) {
  const { account, parentAccount } = useSelector(
    accountAndParentScreenSelectorCreator(route),
  );

  function onSelectDevice(meta: *): void {
    navigation.replace(ScreenName.SendValidation, {
      ...route.params,
      ...meta,
    });
  }

  if (!account) return null;
  const mainAccount = getMainAccount(account, parentAccount);
  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <TrackScreen category="SendFunds" name="ConnectDevice" />
        <SelectDevice
          onSelect={onSelectDevice}
          steps={[connectingStep, accountApp(mainAccount)]}
        />
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
