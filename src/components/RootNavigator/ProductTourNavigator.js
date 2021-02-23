// @flow
import React, { useMemo, useContext } from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  HeaderBackButton,
} from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { useTheme, useNavigation } from "@react-navigation/native";
import { ScreenName, NavigatorName } from "../../const";
import ProductTourMenu from "../../screens/ProductTour/ProductTourMenu";
import { context, completeStep } from "../../screens/ProductTour/Provider";
import Button from "../Button";
import ProductTourStepStart from "../../screens/ProductTour/ProductTourStepStart";
import { getStackNavigatorConfig } from "../../navigation/navigatorConfig";
import { navigate } from "../../rootnavigation";

export default function ProductTourNavigator() {
  const { colors } = useTheme();
  const ptContext = useContext(context);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const stackNavigationConfig = useMemo(
    () => getStackNavigatorConfig(colors, true),
    [colors],
  );

  const headerStyle = {
    backgroundColor: colors.live,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    elevation: 0,
  };

  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={{
        ...stackNavigationConfig,
        gestureEnabled: Platform.OS === "ios",
        headerStyle,
        headerTitleStyle: { color: colors.white },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen
        name={ScreenName.ProductTourMenu}
        component={ProductTourMenu}
        options={{
          headerShown: true,
          headerRight: null,
          headerTitle: null,
          headerLeft: props => (
            <HeaderBackButton
              {...props}
              onPress={() => {
                navigate(NavigatorName.Main, {
                  screen: ScreenName.Portfolio,
                });
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name={ScreenName.ProductTourStepStart}
        component={ProductTourStepStart}
        options={{
          headerShown: true,
          headerRight:
            ptContext.currentStep === "BUY_COINS"
              ? () => (
                  <Button
                    type="primary"
                    containerStyle={{ backgroundColor: "transparent" }}
                    onPress={() =>{
                      completeStep(ptContext.currentStep);
                      navigation.navigate(NavigatorName.ProductTour, {
                        screen: ScreenName.ProductTourMenu,
                      });
                    }}
                    title={t("producttour.stepstart.buymaybe")}
                  />
                )
              : null,
          headerTitle: null,
          headerStyle: {
            ...headerStyle,
            backgroundColor: "#587ED4",
          },
        }}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
