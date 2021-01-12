/* @flow */
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import SettingsRow from "../../../components/SettingsRow";
import { navigate } from "../../../rootnavigation";
import { NavigatorName, ScreenName } from "../../../const";

class ProductTourRow extends PureComponent<*> {
  render() {
    return (
      <SettingsRow
        event="ProductTourRow"
        title={<Trans i18nKey="settings.help.productTour" />}
        desc={<Trans i18nKey="settings.help.productTourDesc" />}
        onPress={() => {
          navigate(NavigatorName.ProductTour, {
            screen: ScreenName.ProductTourMenu,
          });
        }}
        alignedTop
      />
    );
  }
}

export default ProductTourRow;
