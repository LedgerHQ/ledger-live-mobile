// @flow
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { accountAndParentScreenSelector } from "../../../reducers/accounts";
import colors from "../../../colors";
import { TrackScreen } from "../../../analytics";
import SelectDevice from "../../../components/SelectDevice";
import {
  connectingStep,
  accountApp,
} from "../../../components/DeviceJob/steps";

const forceInset = { bottom: "always" };

export default function ConnectDevice() {
  const navigation = useNavigation();
  const { account, parentAccount } = useSelector(
    accountAndParentScreenSelector,
  );

  function onSelectDevice(meta: *): void {
    navigation.replace("DelegationValidation", {
      ...navigation.state.params,
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
        <TrackScreen category="DelegationFlow" name="ConnectDevice" />
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
