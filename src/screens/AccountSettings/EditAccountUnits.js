/* @flow */
import React, { PureComponent } from "react";
import { View, StyleSheet, ScrollView, FlatList } from "react-native";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation } from "react-i18next";
import { accountAndParentScreenSelectorCreator } from "../../reducers/accounts";
import { updateAccount } from "../../actions/accounts";
import SettingsRow from "../../components/SettingsRow";
import Touchable from "../../components/Touchable";

interface RouteParams {
  accountId: string;
}

interface Props {
  navigation: *;
  route: { params: RouteParams };
  updateAccount: Function;
  account: Account;
}

const mapStateToProps = (state, { route }) =>
  accountAndParentScreenSelectorCreator(route)(state);

const mapDispatchToProps = {
  updateAccount,
};

class EditAccountUnits extends PureComponent<Props> {
  keyExtractor = (item: any) => item.code;

  updateAccount = (item: any) => {
    const { account, navigation, updateAccount } = this.props;
    const updatedAccount = {
      ...account,
      unit: item,
    };
    updateAccount(updatedAccount);
    navigation.goBack();
  };

  render() {
    const { account } = this.props;
    const accountUnits = account.currency.units;
    return (
      <ScrollView contentContainerStyle={styles.root}>
        <View style={styles.body}>
          <FlatList
            data={accountUnits}
            keyExtractor={this.keyExtractor}
            renderItem={({ item }) => (
              <Touchable
                event="EditAccountUnits"
                eventProperties={{
                  currency: account.currency.id,
                  unit: item.code,
                }}
                onPress={() => {
                  this.updateAccount(item);
                }}
              >
                <SettingsRow
                  title={item.code}
                  selected={account.unit.code === item.code}
                  compact
                />
              </Touchable>
            )}
          >
            {account.unit.code}
          </FlatList>
        </View>
      </ScrollView>
    );
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation(),
)(EditAccountUnits);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 64,
  },
  body: {
    flexDirection: "column",
    flex: 1,
  },
});
