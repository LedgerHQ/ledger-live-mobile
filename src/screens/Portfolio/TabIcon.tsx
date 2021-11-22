// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { PortfolioMedium } from "@ledgerhq/native-ui/assets/icons";

import TabIcon from "../../components/TabIcon";
import { scrollToTop } from "../../navigation/utils";
// eslint-disable-next-line import/named
import { accountsSelector } from "../../reducers/accounts";

export default function PortfolioTabIcon(props: any) {
  const accounts = useSelector(accountsSelector);
  const isFocused = useIsFocused();

  if (!isFocused || accounts.length === 0) {
    return (
      <TabIcon Icon={PortfolioMedium} i18nKey="tabs.portfolio" {...props} />
    );
  }

  return (
    <TouchableOpacity onPress={scrollToTop}>
      <TabIcon Icon={PortfolioMedium} i18nKey="tabs.portfolio" {...props} />
    </TouchableOpacity>
  );
}
