// @flow

import React, { useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { withNavigation } from "@react-navigation/compat";
import { connect } from "react-redux";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import { ScreenName } from "../../const";
import { connectingStep, currencyApp } from "../../components/DeviceJob/steps";
import SelectDevice from "../../components/SelectDevice";

const forceInset = { bottom: "always" };

interface Props {
  navigation: *;
  route: *;
}

const ConnectDevice = ({ navigation, route }: Props) => {
  const onSelectDevice = useCallback(
    deviceMeta => {
      navigation.navigate(ScreenName.MigrateAccountsProgress, {
        currency: route.params?.currency,
        deviceMeta,
      });
    },
    [navigation, route.params],
  );

  return (
    <SafeAreaView style={styles.root} forceInset={forceInset}>
      <TrackScreen category="MigrateAccount" name="ConnectDevice" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        <SelectDevice
          deviceMeta={route.params?.deviceMeta}
          onSelect={onSelectDevice}
          autoSelectOnAdd
          steps={[connectingStep, currencyApp(route.params?.currency)]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  footer: {
    padding: 4,
    borderTopWidth: 1,
    borderTopColor: colors.lightFog,
  },
});

export default connect()(withNavigation(ConnectDevice)); // NB flow issue if not connected
