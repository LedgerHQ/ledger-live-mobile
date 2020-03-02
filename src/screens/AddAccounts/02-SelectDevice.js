// @flow

import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { StyleSheet, ScrollView } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

import { prepareCurrency } from "../../bridge/cache";
import { ScreenName } from "../../const";
import colors from "../../colors";
import { TrackScreen } from "../../analytics";
import SelectDevice from "../../components/SelectDevice";
import { connectingStep, currencyApp } from "../../components/DeviceJob/steps";

const forceInset = { bottom: "always" };

interface RouteParams {
  currency: CryptoCurrency;
}

interface Props {
  navigation: *;
  route: { params: RouteParams };
}

type State = {};

class AddAccountsSelectDevice extends Component<Props, State> {
  componentDidMount() {
    const currency = this.props.route.params?.currency;
    // load ahead of time
    prepareCurrency(currency);
  }

  onSelectDevice = (meta: *) => {
    const currency = this.props.route.params?.currency;
    this.props.navigation.navigate(ScreenName.AddAccountsAccounts, {
      currency,
      ...meta,
    });
  };

  render() {
    const currency = this.props.route.params?.currency;
    return (
      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContainer}
        >
          <TrackScreen category="AddAccounts" name="SelectDevice" />
          <SelectDevice
            onSelect={this.onSelectDevice}
            steps={[connectingStep, currencyApp(currency)]}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }
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

export default withTranslation()(AddAccountsSelectDevice);
