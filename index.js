import { AppRegistry } from "react-native";
import { Sentry } from "react-native-sentry";
import App from "./src";

Sentry.config(
  "https://beb25fd89630498990fd16bbc5b92fc1:9ec602a751334c6087c74aef34042afd@sentry.io/273101"
);
if (!__DEV__) {
  Sentry.install();
}

AppRegistry.registerComponent("ledgerwalletmobile", () => App);
