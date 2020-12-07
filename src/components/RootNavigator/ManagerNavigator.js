// @flow
import React, { useContext } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ScreenName, NavigatorName } from "../../const";
import { hasAvailableUpdateSelector } from "../../reducers/settings";
import Manager from "../../screens/Manager";
import ManagerMain from "../../screens/Manager/Manager";
import OnboardingNavigator from "./OnboardingNavigator";
import { stackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import ReadOnlyTab from "../ReadOnlyTab";
import ManagerIcon from "../../icons/Manager";
import NanoXIcon from "../../icons/TabNanoX";
import { useIsNavLocked } from "./CustomBlockRouterNavigator";
import colors from "../../colors";
import { context as _ptContext } from "../../screens/ProductTour/Provider";
import { navigate } from "../../rootnavigation";

const ManagerIconWithUpate = ({
  color,
  size,
}: {
  color: string,
  size: number,
}) => {
  return (
    <View style={stylesLocal.iconWrapper}>
      <ManagerIcon size={size} color={color} />
      <View style={stylesLocal.blueDot} />
    </View>
  );
};

export default function ManagerNavigator() {
  const { t } = useTranslation();
  const ptContext = useContext(_ptContext);

  return (
    <Stack.Navigator
      screenOptions={{
        ...stackNavigatorConfig,
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
          headerRight: null,
          gestureEnabled: false,
          headerLeft:
            ptContext.currentStep === "INSTALL_CRYPTO"
              ? props => (
                  <HeaderBackButton
                    {...props}
                    onPress={() => {
                      navigate(NavigatorName.ProductTour, {
                        screen: ScreenName.ProductTourMenu,
                      });
                    }}
                  />
                )
              : null,
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
      <Stack.Screen
        name={NavigatorName.Onboarding}
        component={OnboardingNavigator}
        options={{ headerShown: false }}
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
    backgroundColor: colors.live,
    borderRadius: 4,
  },
  iconWrapper: {
    position: "relative",
  },
});
