import React from "react";
import HeaderRightClose from "../components/HeaderRightClose";
import HeaderTitle from "../components/HeaderTitle";
import HeaderBackImage from "../components/HeaderBackImage";
import styles from "./styles";

export const defaultNavigationOptions = {
  headerStyle: styles.header,
  headerTitle: (props: any) => <HeaderTitle {...props} />,
  headerBackTitleVisible: false,
  headerBackImage: () => <HeaderBackImage />,
  headerTitleAllowFontScaling: false,
};

export const getStackNavigatorConfig = (c: any, closable: boolean = false) => ({
  ...defaultNavigationOptions,
  cardStyle: { backgroundColor: c.background.main || c.white },
  headerTitleAlign: "center",
  headerTitleStyle: {
    color: c.darkBlue,
  },
  headerRight: closable ? () => <HeaderRightClose /> : undefined,
});
