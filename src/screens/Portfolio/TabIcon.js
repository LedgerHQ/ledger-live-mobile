// @flow
import React from "react";
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import TabIcon from "../../components/TabIcon";
import PortfolioIcon from "../../icons/Portfolio";
import { scrollToTop } from "../../navigation/utils";

export default function PortfolioTabIcon(props: Props) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return <TabIcon Icon={PortfolioIcon} i18nKey="tabs.portfolio" {...props} />;
  }

  return (
    <TouchableOpacity onPress={scrollToTop}>
      <TabIcon Icon={PortfolioIcon} i18nKey="tabs.portfolio" {...props} />
    </TouchableOpacity>
  );
}
