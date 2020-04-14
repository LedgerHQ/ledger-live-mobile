/* @flow */
import React, { Component } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { connect } from "react-redux";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { urls } from "../../config/urls";
import { accountAndParentScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import ValidateError from "../../components/ValidateError";

const forceInset = { bottom: "always" };

type Props = {
  account: Account,
  parentAccount: ?Account,
  navigation: any,
  route: { params: RouteParams },
};

type RouteParams = {
  accountId: string,
  deviceId: string,
  transaction: *,
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
    const { navigation } = this.props;
    const error = navigation.getParam("error");

    return (
      <SafeAreaView style={styles.root} forceInset={forceInset}>
        <TrackScreen category="UnfreezeFunds" name="ValidationError" />
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

const mapStateToProps = accountAndParentScreenSelector;

export default connect(mapStateToProps)(ValidationError);
