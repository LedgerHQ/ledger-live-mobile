/* @flow */
import React, { useContext } from "react";
import { Trans } from "react-i18next";
import SettingsRow from "../../../components/SettingsRow";
import Switch from "../../../components/Switch";
import {
  dismiss as dismissTour,
  context as _ptContext,
} from "../../ProductTour/Provider";

const ProductTourRow = () => {
  const ptContext = useContext(_ptContext);
  return (
    <SettingsRow
      event="ProductTourRow"
      title={<Trans i18nKey="settings.help.productTour" />}
      desc={<Trans i18nKey="settings.help.productTourDesc" />}
      onPress={null}
      alignedTop
    >
      <Switch
        style={{ opacity: 0.99 }}
        value={!ptContext.dismissed}
        onValueChange={() => {
          dismissTour(!ptContext.dismissed);
        }}
      />
    </SettingsRow>
  );
};

export default ProductTourRow;
