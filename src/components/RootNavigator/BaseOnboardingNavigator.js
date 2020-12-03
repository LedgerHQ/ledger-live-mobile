// @flow
import React, { useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenName, NavigatorName } from "../../const";
import PairDevices from "../../screens/PairDevices";
import EditDeviceName from "../../screens/EditDeviceName";
import OnboardingNavigator from "./OnboardingNavigator";
import ImportAccountsNavigator from "./ImportAccountsNavigator";
import PasswordAddFlowNavigator from "./PasswordAddFlowNavigator";
import PasswordModifyFlowNavigator from "./PasswordModifyFlowNavigator";
import { closableStackNavigatorConfig } from "../../navigation/navigatorConfig";
import styles from "../../navigation/styles";
import Question from "../../icons/Question";
import colors from "../../colors";
import { pairNewErrorInfoModalProps } from "../../screens/Onboarding/shared/infoPagesData";

const hitSlop = {
  bottom: 10,
  left: 24,
  right: 24,
  top: 10,
};

const ErrorHeaderInfo = () => {
  const navigation = useNavigation();
  const openInfoModal = useCallback(() => {
    navigation.navigate(ScreenName.OnboardingInfoModal, {
      sceneInfoProps: pairNewErrorInfoModalProps,
    });
  }, [navigation]);

  return (
    <Pressable
      style={{ marginRight: 24 }}
      hitSlop={hitSlop}
      onPress={openInfoModal}
    >
      <Question size={20} color={colors.darkBlue} />
    </Pressable>
  );
};

export default function BaseOnboardingNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        ...closableStackNavigatorConfig,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={NavigatorName.Onboarding}
        component={OnboardingNavigator}
      />
      <Stack.Screen
        name={NavigatorName.ImportAccounts}
        component={ImportAccountsNavigator}
      />
      <Stack.Screen
        name={ScreenName.PairDevices}
        component={PairDevices}
        options={{
          title: null,
          headerRight: ErrorHeaderInfo,
          headerShown: true,
          headerStyle: styles.headerNoShadow,
        }}
      />
      <Stack.Screen
        name={ScreenName.EditDeviceName}
        component={EditDeviceName}
        options={{
          title: t("EditDeviceName.title"),
          headerLeft: null,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={NavigatorName.PasswordAddFlow}
        component={PasswordAddFlowNavigator}
      />
      <Stack.Screen
        name={NavigatorName.PasswordModifyFlow}
        component={PasswordModifyFlowNavigator}
      />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
