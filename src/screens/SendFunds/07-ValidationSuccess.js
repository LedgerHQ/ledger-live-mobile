/* @flow */
import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import type {
  TokenAccount,
  Account,
  Operation,
} from "@ledgerhq/live-common/lib/types";
import { accountScreenSelector } from "../../reducers/accounts";
import { TrackScreen } from "../../analytics";
import colors from "../../colors";
import { ScreenName } from "../../const";
import PreventNativeBack from "../../components/PreventNativeBack";
import ValidateSuccess from "../../components/ValidateSuccess";

interface RouteParams {
  accountId: string;
  deviceId: string;
  transaction: *;
  result: Operation;
}

interface Props {
  account: ?(TokenAccount | Account);
  parentAccount: ?Account;
  navigation: *;
  route: { params: RouteParams };
}

class ValidationSuccess extends Component<Props> {
  onClose = () => {
    this.props.navigation.dangerouslyGetParent().pop();
  };

  goToOperationDetails = () => {
    const { navigation, route, account, parentAccount } = this.props;
    if (!account) return;
    const result = route.params?.result;
    if (!result) return;
    navigation.navigate(ScreenName.OperationDetails, {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
      operation: result,
    });
  };

  render() {
    return (
      <View style={styles.root}>
        <TrackScreen category="SendFunds" name="ValidationSuccess" />
        <PreventNativeBack />
        <ValidateSuccess
          onClose={this.onClose}
          onViewDetails={this.goToOperationDetails}
        />
      </View>
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

export default connect(mapStateToProps)(withTranslation()(ValidationSuccess));
