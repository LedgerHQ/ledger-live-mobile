/* @flow */
import React, { Component } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { accountScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import ValidateError from "../../components/ValidateError";
import { urls } from "../../config/urls";

const forceInset = { bottom: "always" };

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  parentId: String,
  deviceId: string,
  transaction: any,
  error: Error,
};

class ValidationError extends Component<Props> {
  onClose = () => {
    this.props.navigation.dangerouslyGetParent().pop();
  };

  contactUs = () => {
    Linking.openURL(urls.contact);
  };

  retry = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const error = this.props.route.params?.error;

    return (
      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <TrackScreen category="SendFunds" name="ValidationError" />
        <ValidateError
          error={error}
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

const mapStateToProps = (state, { route }) =>
  accountScreenSelector(route)(state);

export default connect(mapStateToProps)(withTranslation()(ValidationError));
