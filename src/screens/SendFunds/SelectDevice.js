// @flow
import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type {
  Transaction,
  TransactionStatus,
} from "@ledgerhq/live-common/lib/types";
import colors from "../../colors";
import { ScreenName } from "../../const";
import { TrackScreen } from "../../analytics";
import SelectDeviceComp from "../../components/SelectDevice";
import NavigationScrollView from "../../components/NavigationScrollView";

const forceInset = { bottom: "always" };

type Props = {
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  transaction: Transaction,
  status: TransactionStatus,
};

export default function SelectDevice({ navigation, route }: Props) {
  const onSelect = useCallback(
    device => {
      navigation.navigate(ScreenName.SendConnectDevice, {
        ...route.params,
        device,
        context: "Send",
      });
    },
    [navigation, route.params],
  );

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <NavigationScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <TrackScreen category="SendFunds" name="ConnectDevice" />
        <SelectDeviceComp onSelect={onSelect} />
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
