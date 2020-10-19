// @flow

import React from "react";
import HeaderRightClose from "../components/HeaderRightClose";
import HeaderTitle from "../components/HeaderTitle";
import HeaderBackImage from "../components/HeaderBackImage";
import { getFontStyle } from "../components/LText";
import styles from "./styles";
import colors from "../colors";

export const defaultNavigationOptions = {
  headerStyle: styles.header,
  headerTitle: (props: *) => {
    return <HeaderTitle {...props} />;
  },
  headerBackTitleVisible: false,
  headerBackImage: () => <HeaderBackImage />,
  headerTitleAllowFontScaling: false,
};

export const stackNavigatorConfig = {
  ...defaultNavigationOptions,
  cardStyle: { backgroundColor: colors.lightGrey },
  headerTitleAlign: "center",
};

export const getStackNavigatorConfig = (c: *, closable: boolean = false) => ({
  ...defaultNavigationOptions,
  cardStyle: { backgroundColor: c.white },
  headerTitleAlign: "center",
  headerTitleStyle: {
    color: c.darkBlue,
  },
  ...(closable ? { headerRight: () => <HeaderRightClose /> } : {}),
});

export const closableNavigationOptions = {
  ...defaultNavigationOptions,
  headerRight: () => <HeaderRightClose />,
};

export const closableStackNavigatorConfig = {
  ...stackNavigatorConfig,
  ...closableNavigationOptions,
};

export const topTabNavigatorConfig = {
  tabBarOptions: {
    allowFontScaling: false,
    activeTintColor: colors.live,
    inactiveTintColor: colors.grey,
    upperCaseLabel: false,
    labelStyle: {
      fontSize: 14,
      ...getFontStyle({
        semiBold: true,
      }),
    },
    style: {
      backgroundColor: colors.white,
      height: 48,
    },
    indicatorStyle: {
      backgroundColor: colors.live,
    },
  },
};
