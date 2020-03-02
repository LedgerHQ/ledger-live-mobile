// @flow

import React from "react";
import { Trans, withTranslation } from "react-i18next";

import HeaderRightClose from "../../components/HeaderRightClose";

type Props = {
  navigation: *,
};

const routesWithConfirmation = ["AddAccountsAccounts"];

function AddAccountsHeaderRightClose({ navigation }: Props) {
  return (
    <HeaderRightClose
      navigation={navigation}
      withConfirmation={routesWithConfirmation.includes(
        navigation.state.routeName,
      )}
      confirmationTitle={<Trans i18nKey="addAccounts.quitConfirmation.title" />}
      confirmationDesc={<Trans i18nKey="addAccounts.quitConfirmation.desc" />}
    />
  );
}

export default withTranslation()(AddAccountsHeaderRightClose);
