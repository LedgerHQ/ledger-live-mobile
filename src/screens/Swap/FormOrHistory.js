// @flow
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import type {
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types/account";
import { useTheme } from "@react-navigation/native";
import { ScreenName } from "../../const";
import Platform from "../../components/WebPlatformPlayer";
import Swap from "./Swap";
import History from "./History";
import styles from "../../navigation/styles";
import LText from "../../components/LText";

// TODO: Rename this file/screen

type RouteParams = {
  defaultAccount: ?AccountLike,
  defaultParentAccount: ?Account,
};

type TabLabelProps = {
  focused: boolean,
  color: string,
};

export default ({ route }: { route: { params: RouteParams } }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  // FIXME: Hardcoded for now
  const platform = "paraswap";

  return (
    <Tab.Navigator
      tabBarOptions={{
        headerStyle: styles.headerNoShadow,
        indicatorStyle: {
          backgroundColor: colors.live,
        },
      }}
    >
      <Tab.Screen
        name={ScreenName.SwapPlatform}
        options={{
          title: t("exchange.buy.tabTitle"),
          tabBarLabel: ({ focused, color }: TabLabelProps) => (
            <LText style={{ width: "110%", color }} semiBold={focused}>
              {t("transfer.swap.platform.tab")}
            </LText>
          ),
        }}
      >
        {props => (
          <Platform {...props} {...route?.params} platform={platform} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name={ScreenName.SwapForm}
        options={{
          title: t("exchange.buy.tabTitle"),
          tabBarLabel: ({ focused, color }: TabLabelProps) => (
            <LText style={{ width: "110%", color }} semiBold={focused}>
              {t("transfer.swap.form.tab")}
            </LText>
          ),
        }}
      >
        {props => <Swap {...props} {...route?.params} />}
      </Tab.Screen>
      <Tab.Screen
        name={ScreenName.SwapHistory}
        component={History}
        options={{
          title: t("exchange.buy.tabTitle"),
          tabBarLabel: ({ focused, color }: TabLabelProps) => (
            <LText style={{ width: "110%", color }} semiBold={focused}>
              {t("transfer.swap.history.tab")}
            </LText>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Tab = createMaterialTopTabNavigator();
