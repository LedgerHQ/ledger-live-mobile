/* @flow */
import React, { Component } from "react";
import { View, StyleSheet, Linking } from "react-native";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import type {
  TokenAccount,
  Account,
  Operation,
  Transaction,
} from "@ledgerhq/live-common/lib/types";
import { accountScreenSelector } from "../../../reducers/accounts";
import { TrackScreen } from "../../../analytics";
import colors from "../../../colors";
import PreventNativeBack from "../../../components/PreventNativeBack";
import ValidateSuccess from "../../../components/ValidateSuccess";
import Button from "../../../components/Button";
import { urls } from "../../../config/urls";

interface RouteParams {
  accountId: string;
  deviceId: string;
  transaction: Transaction;
  result: Operation;
}

interface Props {
  account: ?(TokenAccount | Account);
  parentAccount: ?Account;
  navigation: *;
  route: { params: RouteParams };
}

class ValidationSuccess extends Component<Props> {
  dismiss = () => {
    const { navigation } = this.props;
    if (navigation.dismiss) {
      const dismissed = navigation.dismiss();
      if (!dismissed) navigation.goBack();
    }
  };

  goToAccount = () => {
    const { navigation, account, parentAccount } = this.props;
    if (!account) return;
    navigation.navigate("Account", {
      accountId: account.id,
      parentId: parentAccount && parentAccount.id,
    });
  };

  goToHelp = () => {
    Linking.openURL(urls.delegation);
  };

  render() {
    const transaction = this.props.route.params?.transaction;
    if (transaction.family !== "tezos") return null;
    return (
      <View style={styles.root}>
        <TrackScreen category="SendFunds" name="ValidationSuccess" />
        <PreventNativeBack />
        <ValidateSuccess
          title={
            <Trans
              i18nKey={"delegation.broadcastSuccessTitle." + transaction.mode}
            />
          }
          description={
            <Trans
              i18nKey={
                "delegation.broadcastSuccessDescription." + transaction.mode
              }
            />
          }
          primaryButton={
            <Button
              event="DelegationSuccessGoToAccount"
              title={<Trans i18nKey="delegation.goToAccount" />}
              type="primary"
              containerStyle={styles.button}
              onPress={this.goToAccount}
            />
          }
          secondaryButton={
            <Button
              event="DelegationSuccessHowTo"
              title={<Trans i18nKey="delegation.howDelegationWorks" />}
              type="lightSecondary"
              containerStyle={styles.button}
              onPress={this.goToHelp}
            />
          }
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
  button: {
    alignSelf: "stretch",
    marginTop: 24,
  },
});

const mapStateToProps = (state, { route }) =>
  accountScreenSelector(route)(state);

export default connect(mapStateToProps)(withTranslation()(ValidationSuccess));
