/* @flow */
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { Switch } from "react-native";
import { createStructuredSelector } from "reselect";
import SettingsRow from "../../../components/SettingsRow";
import { setHideEmptyTokenAccounts } from "../../../actions/settings";
import { hideEmptyTokenAccountsEnabledSelector } from "../../../reducers/settings";

type Props = {
  hideEmptyTokenAccountsEnabled: boolean,
  setHideEmptyTokenAccounts: boolean => void,
};
const mapStateToProps = createStructuredSelector({
  hideEmptyTokenAccountsEnabled: hideEmptyTokenAccountsEnabledSelector,
});

const mapDispatchToProps = {
  setHideEmptyTokenAccounts,
};

class HideEmptyTokenAccountsRow extends PureComponent<Props> {
  render() {
    const {
      hideEmptyTokenAccountsEnabled,
      setHideEmptyTokenAccounts,
      ...props
    } = this.props;
    return (
      <SettingsRow
        event="HideEmptyTokenAccountsRow"
        title={<Trans i18nKey="settings.display.hideEmptyTokenAccounts" />}
        desc={<Trans i18nKey="settings.display.hideEmptyTokenAccountsDesc" />}
        onPress={null}
        alignedTop
        {...props}
      >
        <Switch
          style={{ opacity: 0.99 }}
          value={hideEmptyTokenAccountsEnabled}
          onValueChange={setHideEmptyTokenAccounts}
        />
      </SettingsRow>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HideEmptyTokenAccountsRow);
