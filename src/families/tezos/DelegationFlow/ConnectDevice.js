// @flow
import React from "react";
import { StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { accountScreenSelector } from "../../../reducers/accounts";
import colors from "../../../colors";
import { TrackScreen } from "../../../analytics";
import SelectDevice from "../../../components/SelectDevice";
import {
  connectingStep,
  accountApp,
} from "../../../components/DeviceJob/steps";
import NavigationScrollView from "../../../components/NavigationScrollView";

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
  const { account, parentAccount } = useSelector(accountScreenSelector(route));

  function onSelectDevice(meta: *): void {
    navigation.replace("DelegationValidation", {
      ...route.params,
      ...meta,
    });
  }

  if (!account) return null;
  const mainAccount = getMainAccount(account, parentAccount);

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <NavigationScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <TrackScreen category="DelegationFlow" name="ConnectDevice" />
        <SelectDevice
          onSelect={onSelectDevice}
          steps={[connectingStep, accountApp(mainAccount)]}
        />
      </NavigationScrollView>
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
