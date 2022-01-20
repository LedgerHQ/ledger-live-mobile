// @flow
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useTranslation } from "react-i18next";
import { ScreenName } from "../../const";
import Buy from "../../screens/Exchange/Buy";
import Coinify from "../../screens/Exchange/Coinify";

export default function BuyNavigator() {
    const { t } = useTranslation();

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen
                name={ScreenName.ExchangeBuy}
                component={Buy}
            />
            <Stack.Screen
                name={ScreenName.Coinify}
                component={Coinify}
            />
        </Stack.Navigator>
    );
}

const Stack = createStackNavigator();
