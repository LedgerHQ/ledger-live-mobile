// @flow
import React, { useContext, useMemo } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavigatorName, ScreenName } from "../../const";
import { hasAvailableUpdateSelector } from "../../reducers/settings";
import Manager from "../../screens/Manager";
import ManagerMain from "../../screens/Manager/Manager";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import ReadOnlyTab from "../ReadOnlyTab";
import ManagerIcon from "../../icons/Manager";
import NanoXIcon from "../../icons/TabNanoX";
import { useIsNavLocked } from "./CustomBlockRouterNavigator";
import { context as _ptContext } from "../../screens/ProductTour/Provider";
import { navigate } from "../../rootnavigation";
import HeaderRightClose from "../HeaderRightClose";

const ManagerIconWithUpate = ({
  color,
  size,
}: {
  color: string,
  size: number,
}) => {
  const { colors } = useTheme();
  return (
    <View style={stylesLocal.iconWrapper}>
      <ManagerIcon size={size} color={color} />
      <View style={[stylesLocal.blueDot, { backgroundColor: colors.live }]} />
    </View>
  );
};

export default function ManagerNavigator() {
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);
  const { colors } = useTheme();
  const stackNavConfig = useMemo(() => getStackNavigatorConfig(colors), [
    colors,
  ]);

  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavConfig,
        headerStyle:
          ptContext.currentStep === "INSTALL_CRYPTO"
            ? { backgroundColor: colors.live }
            : styles.header,
        headerTitleStyle:
          ptContext.currentStep === "INSTALL_CRYPTO"
            ? {
                color: colors.white,
              }
            : {},
        headerTintColor:
          ptContext.currentStep === "INSTALL_CRYPTO" ? colors.white : null,
        headerRight:
          ptContext.currentStep && ptContext.currentStep !== "INSTALL_CRYPTO"
            ? () => (
                <HeaderRightClose
                  skipNavigation
                  onClose={() => {
                    navigate(NavigatorName.Base, {
                      screen: NavigatorName.ProductTour,
                      params: {
                        screen: ScreenName.ProductTourStepStart,
                      },
                    });
                  }}
                />
              )
            : null,
      }}
    >
      <Stack.Screen
        name={ScreenName.Manager}
        component={Manager}
        options={{
          title:
            ptContext.currentStep === "INSTALL_CRYPTO"
              ? t("producttour.installCryptoTitle")
              : t("manager.title"),
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={ScreenName.ManagerMain}
        component={ManagerMain}
        options={{
          title:
            ptContext.currentStep === "INSTALL_CRYPTO"
              ? t("producttour.installCryptoTitle")
              : t("manager.appList.title"),
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();

export function ManagerTabIcon(props: any) {
  const isNavLocked = useIsNavLocked();
  const hasAvailableUpdate = useSelector(hasAvailableUpdateSelector);

  const content = (
    <ReadOnlyTab
      OnIcon={NanoXIcon}
      oni18nKey="tabs.nanoX"
      OffIcon={hasAvailableUpdate ? ManagerIconWithUpate : ManagerIcon}
      offi18nKey="tabs.manager"
      {...props}
    />
  );

  if (isNavLocked) {
    return <TouchableOpacity onPress={() => {}}>{content}</TouchableOpacity>;
  }

  return content;
}

const stylesLocal = StyleSheet.create({
  blueDot: {
    top: 0,
    right: -10,
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 4,
  },
  iconWrapper: {
    position: "relative",
  },
});
