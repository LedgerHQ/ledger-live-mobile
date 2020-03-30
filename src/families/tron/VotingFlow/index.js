// @flow
import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import i18next from "i18next";
import { closableStackNavigatorConfig } from "../../../navigation/navigatorConfig";

import VotingStarted from "./Started";

const VotingFlow = createStackNavigator(
  {
    VotingStarted: {
      // $FlowFixMe
      screen: VotingStarted,
      navigationOptions: {
        title: i18next.t("tron.voting.flow.started.title"),
      },
    },
  },
  closableStackNavigatorConfig,
);

VotingFlow.navigationOptions = ({ navigation }) => ({
  header: null,
  gesturesEnabled:
    Platform.OS === "ios"
      ? navigation.getParam("allowNavigation", true)
      : false,
});

export default VotingFlow;
