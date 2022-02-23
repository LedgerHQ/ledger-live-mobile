// @flow
import Config from "react-native-config";

if (Config.DETOX) {
  import("./bridge/client").then(({ init }) => init());
}
