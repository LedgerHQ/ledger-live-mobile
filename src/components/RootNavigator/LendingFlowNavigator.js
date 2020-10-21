// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import LendingTerms from "../../screens/Lending/modals/InfoModals/TermsStep";
import LendingInfo1 from "../../screens/Lending/modals/InfoModals/Step-1";
import LendingInfo2 from "../../screens/Lending/modals/InfoModals/Step-2";
import LendingInfo3 from "../../screens/Lending/modals/InfoModals/Step-3";
import styles from "../../navigation/styles";

import {
  PopButton,
  BackButton,
  CloseButton,
} from "../../screens/OperationDetails";

export default function LendingInfoNavigator() {
  const { t } = useTranslation();
  return (
    <Stack.Navigator
      headerMode="float"
      screenOptions={({ route, navigation }) => {
        const { params } = route;
        const onlyTerms = params?.onlyTerms;
        return {
          headerStyle: styles.headerNoShadow,
          title: t("transfer.lending.info.title"),
          ...(onlyTerms
            ? {
                headerLeft: null,
                headerRight: () => <CloseButton navigation={navigation} />,
              }
            : {
                headerLeft: () => <BackButton navigation={navigation} />,
                headerRight: () => <PopButton navigation={navigation} />,
              }),
        };
      }}
    >
      <Stack.Screen name={ScreenName.LendingInfo1} component={LendingInfo1} />
      <Stack.Screen name={ScreenName.LendingInfo2} component={LendingInfo2} />
      <Stack.Screen name={ScreenName.LendingInfo3} component={LendingInfo3} />
      <Stack.Screen name={ScreenName.LendingTerms} component={LendingTerms} />
    </Stack.Navigator>
  );
}

const Stack = createStackNavigator();
