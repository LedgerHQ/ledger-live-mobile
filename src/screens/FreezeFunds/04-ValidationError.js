/* @flow */
import React, { Component } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { connect } from "react-redux";

import type { Account } from "@ledgerhq/live-common/lib/types";

import { accountAndParentScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import { urls } from "../../config/urls";
import ValidateError from "../../components/ValidateError";

const forceInset = { bottom: "always" };

type Props = {
  account: Account,
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  deviceId: string,
  transaction: any,
  error: Error,
};

class ValidationError extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  onClose = () => {
    const { navigation } = this.props;
    navigation.dangerouslyGetParent().pop();
  };

  contactUs = () => {
    Linking.openURL(urls.contact);
  };

  retry = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const { route } = this.props;

    return (
      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <TrackScreen category="FreezeFunds" name="ValidationError" />
        <ValidateError
          error={route.params.error}
          onRetry={this.retry}
          onClose={this.onClose}
          onContactUs={this.contactUs}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

const mapStateToProps = accountAndParentScreenSelector;

export default connect(mapStateToProps)(ValidationError);
