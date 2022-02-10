// @flow
import Config from "react-native-config";

if (Config.DETOX) {
  import("./engine/bridge/client").then(({ init }) => init());
}
